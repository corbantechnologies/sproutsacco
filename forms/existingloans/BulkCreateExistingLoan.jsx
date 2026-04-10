"use client";

import React, { useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import Modal from "@/components/general/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useBulkCreateExistingLoan } from "@/hooks/existingloans/actions";
import { useFetchMembers } from "@/hooks/members/actions";
import { useFetchGLAccounts } from "@/hooks/glaccounts/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import { Plus, Trash2, Save, X } from "lucide-react";
import toast from "react-hot-toast";

export default function BulkCreateExistingLoan({ isOpen, onClose, isInline = false }) {
    const { mutate: bulkCreate, isLoading: isCreating } = useBulkCreateExistingLoan();
    const { data: members, isLoading: isLoadingMembers } = useFetchMembers();
    const { data: glAccounts } = useFetchGLAccounts();
    const { data: paymentAccounts, isLoading: isLoadingPayments } = useFetchPaymentAccounts();

    const initialLoan = {
        member: "",
        principal: "",
        payment_method: "",
        gl_principal_asset: "",
        gl_interest_revenue: "",
        gl_penalty_revenue: "",
    };

    const handleSubmit = (values, { setSubmitting }) => {
        bulkCreate(values.loans, {
            onSuccess: () => {
                if (onClose) onClose();
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
            }
        });
    };

    const content = (
        <Formik
            initialValues={{ loans: [initialLoan] }}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue, isSubmitting, errors }) => (
                <Form className="space-y-6">
                    <div className="overflow-x-auto border rounded bg-slate-50/30">
                        <table className="w-full text-sm text-left border-collapse min-w-[1100px]">
                            <thead className="bg-[#174271] text-white sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 font-semibold border-r border-blue-800/20">Member</th>
                                    <th className="p-4 font-semibold border-r border-blue-800/20 w-48">Principal</th>
                                    <th className="p-4 font-semibold border-r border-blue-800/20">Method</th>
                                    <th className="p-4 font-semibold border-r border-blue-800/20">GL Principal</th>
                                    <th className="p-4 font-semibold border-r border-blue-800/20">GL Interest</th>
                                    <th className="p-4 font-semibold border-r border-blue-800/20">GL Penalty</th>
                                    <th className="p-4 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <FieldArray name="loans">
                                {({ push, remove }) => (
                                    <tbody>
                                        {values.loans.map((loan, index) => {
                                            return (
                                                <tr key={index} className="border-b transition-colors hover:bg-slate-50 even:bg-slate-50/50">
                                                    {/* Member */}
                                                    <td className="p-2 border-r border-slate-200 min-w-[250px]">
                                                        <Select
                                                            onValueChange={(val) => setFieldValue(`loans.${index}.member`, val)}
                                                            value={loan.member}
                                                        >
                                                            <SelectTrigger className="h-10 border-slate-200 rounded">
                                                                <SelectValue placeholder={isLoadingMembers ? "Loading..." : "Select Member"} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {members?.map((m) => (
                                                                    <SelectItem key={m.member_no} value={m.member_no}>
                                                                        {m.first_name} {m.last_name} ({m.member_no})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>

                                                    {/* Principal */}
                                                    <td className="p-2 border-r border-slate-200">
                                                        <Input
                                                            type="number"
                                                            className="h-10 border-slate-200 rounded"
                                                            onChange={(e) => setFieldValue(`loans.${index}.principal`, e.target.value)}
                                                            value={loan.principal}
                                                            placeholder="0.00"
                                                        />
                                                    </td>

                                                    {/* Method */}
                                                    <td className="p-2 border-r border-slate-200 min-w-[150px]">
                                                        <Select
                                                            onValueChange={(val) => setFieldValue(`loans.${index}.payment_method`, val)}
                                                            value={loan.payment_method}
                                                        >
                                                            <SelectTrigger className="h-10 border-slate-200 rounded">
                                                                <SelectValue placeholder={isLoadingPayments ? "Loading..." : "Method"} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {paymentAccounts?.map((pa) => (
                                                                    <SelectItem key={pa.reference} value={pa.name}>{pa.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>

                                                    {/* GL Mapping - Compressed */}
                                                    <td className="p-2 border-r border-slate-200">
                                                        <Select onValueChange={(val) => setFieldValue(`loans.${index}.gl_principal_asset`, val)} value={loan.gl_principal_asset}>
                                                            <SelectTrigger className="h-10 border-slate-200 rounded"><SelectValue placeholder="GL" /></SelectTrigger>
                                                            <SelectContent>{glAccounts?.map(acc => <SelectItem key={acc.reference} value={acc.name}>{acc.name} ({acc.code})</SelectItem>)}</SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="p-2 border-r border-slate-200">
                                                        <Select onValueChange={(val) => setFieldValue(`loans.${index}.gl_interest_revenue`, val)} value={loan.gl_interest_revenue}>
                                                            <SelectTrigger className="h-10 border-slate-200 rounded"><SelectValue placeholder="GL" /></SelectTrigger>
                                                            <SelectContent>{glAccounts?.map(acc => <SelectItem key={acc.reference} value={acc.name}>{acc.name} ({acc.code})</SelectItem>)}</SelectContent>
                                                        </Select>
                                                    </td>
                                                    <td className="p-2 border-r border-slate-200">
                                                        <Select onValueChange={(val) => setFieldValue(`loans.${index}.gl_penalty_revenue`, val)} value={loan.gl_penalty_revenue}>
                                                            <SelectTrigger className="h-10 border-slate-200 rounded"><SelectValue placeholder="GL" /></SelectTrigger>
                                                            <SelectContent>{glAccounts?.map(acc => <SelectItem key={acc.reference} value={acc.name}>{acc.name} ({acc.code})</SelectItem>)}</SelectContent>
                                                        </Select>
                                                    </td>

                                                    {/* Remove Action */}
                                                    <td className="p-2 text-center">
                                                        {values.loans.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => remove(index)}
                                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                )}
                            </FieldArray>
                        </table>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 p-4 rounded border border-slate-200 gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => push(initialLoan)}
                            className="border-[#174271] text-[#174271] hover:bg-blue-50 font-semibold px-6 h-12 flex items-center gap-2 rounded"
                        >
                            <Plus className="w-5 h-5" /> Add Another Row
                        </Button>

                        <div className="flex gap-3">
                            {!isInline && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="font-semibold px-8 h-12 text-slate-500 hover:bg-slate-100 rounded"
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={isSubmitting || isCreating}
                                className="bg-[#174271] hover:bg-[#12355a] text-white font-semibold px-12 h-12 flex items-center gap-2 shadow-sm rounded"
                            >
                                {isSubmitting || isCreating ? "Saving Batch..." : "Onboard All Loans"}
                                <Save className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );

    if (isInline) return content;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Batch Onboard Existing Loans"
            description="Add multiple loans simultaneously in a table view."
            maxWidth="max-w-[95vw]" // Extra wide for table
        >
            {content}
        </Modal>
    );
}

