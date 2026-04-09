"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save, BadgePercent, Landmark, Wallet, Users } from "lucide-react";
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between pb-2">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Manual Collection Batch</h2>
                    <p className="text-sm text-slate-500 font-medium">Record multiple member fee payments across different categories.</p>
                </div>
                <Button variant="ghost" onClick={() => setPayments([{ ...emptyPayment }])} className="text-xs h-9 hover:bg-white border font-bold text-slate-500">
                    Reset Grid
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {payments.map((pay, index) => (
                        <div key={index} className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-amber-50 rounded text-amber-600">
                                        <BadgePercent className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Collection Entry #{index + 1}</span>
                                </div>
                                {payments.length > 1 && (
                                    <Button type="button" onClick={() => removePayment(index)} variant="ghost" className="text-slate-300 hover:text-rose-500 p-2 h-auto opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                <div className="lg:col-span-5 space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                                        <Users className="w-3 h-3" /> Member Fee Account
                                    </Label>
                                    <select
                                        value={pay.fee_account}
                                        onChange={(e) => handleInputChange(index, "fee_account", e.target.value)}
                                        className="w-full border-2 border-slate-950 rounded px-3 h-12 text-sm font-medium focus:ring-0 outline-none bg-white transition-all appearance-none cursor-pointer"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                                        disabled={isLoadingFees}
                                    >
                                        <option value="">Select account...</option>
                                        {outstandingFees?.map(acc => (
                                            <option key={acc.reference} value={acc.account_number}>
                                                {acc.member?.first_name} {acc.member?.last_name} - {acc.fee_type?.name} ({acc.account_number}) • Balance: {Number(acc.outstanding_balance).toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="lg:col-span-3 space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                                        <Wallet className="w-3 h-3" /> Payment Amount
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">KES</span>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={pay.amount}
                                            onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                                            className="h-12 pl-12 text-sm font-bold border-2 border-slate-950 focus:ring-0 rounded"
                                        />
                                    </div>
                                </div>
                                <div className="lg:col-span-4 space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                                        <Landmark className="w-3 h-3" /> Collection Channel
                                    </Label>
                                    <select
                                        value={pay.payment_method}
                                        onChange={(e) => handleInputChange(index, "payment_method", e.target.value)}
                                        className="w-full border-2 border-slate-950 rounded px-3 h-12 text-sm font-medium focus:ring-0 outline-none bg-white transition-all appearance-none cursor-pointer"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                                        disabled={isLoadingPayments}
                                    >
                                        <option value="Cash">Physical Cash</option>
                                        <option value="M-Pesa">M-Pesa Mobile Money</option>
                                        <option value="Bank Transfer">Direct Bank Transfer</option>
                                        {paymentAccounts?.map(acc => (
                                            <option key={acc.reference} value={acc.name}>{acc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button type="button" variant="outline" onClick={addPayment} className="w-full border-2 border-dashed border-slate-200 mt-2 py-8 bg-slate-50/50 hover:bg-slate-50 hover:border-amber-500 hover:text-amber-600 transition-all rounded-xl flex flex-col gap-1 items-center justify-center group h-auto">
                        <Plus className="w-6 h-6 text-slate-300 group-hover:text-amber-500 transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-600">Append Another Entry</span>
                    </Button>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" className="bg-slate-950 hover:bg-slate-800 text-white font-bold h-14 px-12 rounded shadow-lg transition-all active:scale-95 disabled:opacity-50" disabled={loading}>
                        {loading ? "Syndicating Batch..." : "Engage Collection Processing"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default BulkFeePaymentCreate;
