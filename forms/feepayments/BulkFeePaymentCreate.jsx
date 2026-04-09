"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { bulkCreateFeePayments } from "@/services/feepayments";
import { useFetchFeeAccounts } from "@/hooks/feeaccounts/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";

function BulkFeePaymentCreate({ onBatchSuccess }) {
    const [loading, setLoading] = useState(false);
    const token = useAxiosAuth();

    const { data: feeAccounts, isLoading: isLoadingFees } = useFetchFeeAccounts();
    const { data: paymentAccounts, isLoading: isLoadingPayments } = useFetchPaymentAccounts();

    // Filter for accounts with outstanding balance
    const outstandingFees = useMemo(() => {
        return feeAccounts?.filter(acc => Number(acc.outstanding_balance) > 0) || [];
    }, [feeAccounts]);

    const emptyPayment = {
        fee_account: "", // account_number
        amount: "",
        payment_method: "Cash", // default as per backend template
    };

    const [payments, setPayments] = useState([{ ...emptyPayment }]);

    const handleInputChange = (index, field, value) => {
        const newPayments = [...payments];
        newPayments[index][field] = value;

        // Auto-fill outstanding balance if needed (optional UX)
        if (field === "fee_account") {
            const selected = outstandingFees.find(acc => acc.account_number === value);
            if (selected) {
                newPayments[index].amount = selected.outstanding_balance;
            }
        }

        setPayments(newPayments);
    };

    const addPayment = () => {
        if (payments.length < 15) {
            setPayments([...payments, { ...emptyPayment }]);
        }
    };

    const removePayment = (indexToRemove) => {
        setPayments(payments.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const invalidRow = payments.find(p => !p.fee_account || !p.amount || !p.payment_method);
            if (invalidRow) {
                toast.error("Please fill all fields in each row.");
                setLoading(false);
                return;
            }

            await bulkCreateFeePayments({ fee_payments: payments }, token);
            toast.success("Fee payments processed successfully!");
            setPayments([{ ...emptyPayment }]);
            if (onBatchSuccess) onBatchSuccess();
        } catch (error) {
            console.error("Bulk fee payment error:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to process fee payments.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#174271]">Batch Fee Collection</h2>
                    <p className="text-sm text-gray-500 font-medium">Record multiple fee payments (Registration, Insurance, etc.) manually.</p>
                </div>
                <Button variant="outline" onClick={() => setPayments([{ ...emptyPayment }])} className="text-xs h-8">Reset Grid</Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {payments.map((pay, index) => (
                        <div key={index} className="p-4 border border-slate-100 rounded bg-white shadow-sm hover:shadow-md transition-all relative group border-l-4 border-l-amber-500">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 rounded text-amber-600 uppercase tracking-widest">Payment Entry #{index + 1}</span>
                                {payments.length > 1 && (
                                    <Button type="button" onClick={() => removePayment(index)} variant="ghost" className="text-rose-400 hover:text-rose-600 p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-5 space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-slate-400">Target Fee Account</Label>
                                    <select
                                        value={pay.fee_account}
                                        onChange={(e) => handleInputChange(index, "fee_account", e.target.value)}
                                        className="w-full border border-slate-200 rounded px-3 h-10 text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                                        disabled={isLoadingFees}
                                    >
                                        <option value="">-- Select Member Fee Account --</option>
                                        {outstandingFees?.map(acc => (
                                            <option key={acc.reference} value={acc.account_number}>
                                                {acc.member?.first_name} {acc.member?.last_name} - {acc.fee_type?.name} ({acc.account_number}) • Bal: {Number(acc.outstanding_balance).toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-3 space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-slate-400">Payment Amount</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={pay.amount}
                                        onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                                        className="h-10 text-sm font-bold border-slate-200 focus:border-amber-500"
                                    />
                                </div>
                                <div className="md:col-span-4 space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-slate-400">Payment Method</Label>
                                    <select
                                        value={pay.payment_method}
                                        onChange={(e) => handleInputChange(index, "payment_method", e.target.value)}
                                        className="w-full border border-slate-200 rounded px-3 h-10 text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                                        disabled={isLoadingPayments}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="M-Pesa">M-Pesa</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        {paymentAccounts?.map(acc => (
                                            <option key={acc.reference} value={acc.name}>{acc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    {payments.length < 15 && (
                        <Button type="button" variant="outline" onClick={addPayment} className="w-full border-dashed border-2 border-slate-200 py-4 text-slate-400 hover:text-amber-500 hover:border-amber-500 text-xs font-bold transition-all">
                            <Plus className="w-4 h-4 mr-2" /> Add Another Fee Entry
                        </Button>
                    )}
                </div>

                <div className="flex justify-end pt-2">
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 px-12 rounded shadow-lg shadow-amber-50" disabled={loading}>
                        {loading ? "Processing..." : "Commit Payments"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default BulkFeePaymentCreate;
