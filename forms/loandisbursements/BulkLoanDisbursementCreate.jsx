"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { bulkCreateLoanDisbursements } from "@/services/loandisbursements";
import { useFetchLoans } from "@/hooks/loans/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";

function BulkLoanDisbursementCreate({ onBatchSuccess }) {
    const [loading, setLoading] = useState(false);
    const token = useAxiosAuth();

    const { data: loans, isLoading: isLoadingLoans } = useFetchLoans();
    const { data: paymentAccounts, isLoading: isLoadingPayments } = useFetchPaymentAccounts();

    // Filter for Approved but not yet Disbursed loans
    const approvedLoans = useMemo(() => {
        return loans?.filter(loan => loan.application?.status === "Approved") || [];
    }, [loans]);

    const emptyDisbursement = {
        loan_account: "", // reference/account number
        amount: "",
        payment_method: "", // payment account name
    };

    const [disbursements, setDisbursements] = useState([{ ...emptyDisbursement }]);

    const handleInputChange = (index, field, value) => {
        const newDisbursements = [...disbursements];
        newDisbursements[index][field] = value;

        // If loan_account changes, pre-fill amount with loan principal
        if (field === "loan_account") {
            const selectedLoan = approvedLoans.find(l => l.account_number === value);
            if (selectedLoan) {
                newDisbursements[index].amount = selectedLoan.principal;
            }
        }

        setDisbursements(newDisbursements);
    };

    const addDisbursement = () => {
        if (disbursements.length < 15) {
            setDisbursements([...disbursements, { ...emptyDisbursement }]);
        }
    };

    const removeDisbursement = (indexToRemove) => {
        setDisbursements(disbursements.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Validate all fields present
            const invalidRow = disbursements.find(d => !d.loan_account || !d.amount || !d.payment_method);
            if (invalidRow) {
                toast.error("All rows must have a Loan Account, Amount, and Payment Method.");
                setLoading(false);
                return;
            }

            // Duplicate check
            const loanRefs = disbursements.map(d => d.loan_account);
            if (new Set(loanRefs).size !== loanRefs.length) {
                toast.error("Duplicate loan accounts found in the batch. Please remove duplicates.");
                setLoading(false);
                return;
            }

            await bulkCreateLoanDisbursements({ disbursements }, token);
            toast.success("Disbursements processed successfully!");

            // Persistence: Reset state
            setDisbursements([{ ...emptyDisbursement }]);

            if (onBatchSuccess) onBatchSuccess();
        } catch (error) {
            console.error("Bulk disbursement error: ", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to process disbursements!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#174271]">Batch Loan Disbursement</h2>
                    <p className="text-sm text-gray-500">Fund approved loan applications in bulk. Maximum 15 per batch.</p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDisbursements([{ ...emptyDisbursement }])}
                    className="text-xs h-8"
                >
                    Clear All
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {disbursements.map((disb, index) => (
                        <div
                            key={index}
                            className="p-5 border border-slate-100 rounded bg-white shadow-sm hover:shadow-md transition-all relative group border-l-4 border-l-blue-600"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 rounded text-blue-600 uppercase tracking-widest">
                                    Disbursement #{index + 1}
                                </span>
                                {disbursements.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeDisbursement(index)}
                                        variant="ghost"
                                        className="text-rose-400 hover:text-rose-600 p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Loan Account Selector */}
                                <div className="md:col-span-5 space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Loan Account</Label>
                                    <select
                                        value={disb.loan_account}
                                        onChange={(e) => handleInputChange(index, "loan_account", e.target.value)}
                                        className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm transition-colors bg-white h-10 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                        disabled={isLoadingLoans}
                                    >
                                        <option value="">-- Select Approved Loan --</option>
                                        {approvedLoans.map(loan => (
                                            <option key={loan.reference} value={loan.account_number}>
                                                {loan.member?.first_name} {loan.member?.last_name} ({loan.account_number}) - KES {Number(loan.principal).toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                    {approvedLoans.length === 0 && !isLoadingLoans && (
                                        <p className="text-[10px] text-amber-600 font-bold italic">No pending approved loans available.</p>
                                    )}
                                </div>

                                {/* Amount */}
                                <div className="md:col-span-3 space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Disbursement Amount</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={disb.amount}
                                        onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                                        className="h-10 text-sm border-slate-200 focus:border-blue-600 font-bold"
                                    />
                                </div>

                                {/* Payment Account Selector */}
                                <div className="md:col-span-4 space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Source</Label>
                                    <select
                                        value={disb.payment_method}
                                        onChange={(e) => handleInputChange(index, "payment_method", e.target.value)}
                                        className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm transition-colors bg-white h-10 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                        disabled={isLoadingPayments}
                                    >
                                        <option value="">-- Select Source Account --</option>
                                        {paymentAccounts?.map(acc => (
                                            <option key={acc.reference} value={acc.name}>
                                                {acc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    {disbursements.length < 15 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addDisbursement}
                            className="w-full border-dashed border-2 border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2 py-5 text-xs font-bold transition-all rounded"
                        >
                            <Plus className="w-4 h-4" /> Add Another Disbursement
                        </Button>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-12 h-12 flex items-center gap-2 font-bold shadow-lg shadow-blue-100 rounded"
                        disabled={loading || isLoadingLoans || isLoadingPayments}
                    >
                        {loading ? "Processing..." : <><Save className="w-4 h-4" /> Execute Batch</>}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default BulkLoanDisbursementCreate;
