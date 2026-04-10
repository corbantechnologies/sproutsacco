"use client";

import React from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import Modal from "@/components/general/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useBulkCreateExistingLoanPayment } from "@/hooks/existingloanpayments/actions";
import { useFetchExistingLoans } from "@/hooks/existingloans/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import { Plus, Trash2, Save } from "lucide-react";

const validationSchema = Yup.object().shape({
    payments: Yup.array().of(
        Yup.object().shape({
            existing_loan: Yup.string().required("Required"),
            payment_method: Yup.string().required("Required"),
            amount: Yup.number().positive().required("Required"),
            repayment_type: Yup.string().required("Required"),
            transaction_status: Yup.string().required("Required"),
        })
    ).min(1, "At least one payment is required"),
});

export default function BulkCreateExistingLoanPayment({ isOpen, onClose }) {
    const { mutate: bulkCreate, isLoading: isCreating } = useBulkCreateExistingLoanPayment();
    const { data: existingLoans } = useFetchExistingLoans();
    const { data: paymentAccounts } = useFetchPaymentAccounts();

    const initialPayment = {
        existing_loan: "",
        payment_method: "",
        repayment_type: "Regular Repayment",
        amount: "",
        transaction_status: "Completed",
    };

    const handleSubmit = (values, { setSubmitting }) => {
        bulkCreate({ payments: values.payments }, {
            onSuccess: () => {
                onClose();
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
            }
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Batch Record Loan Payments"
            description="Onboard multiple historical payments at once."
            maxWidth="max-w-[90vw]"
        >
            <Formik
                initialValues={{ payments: [initialPayment] }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="overflow-x-auto border rounded-xl bg-slate-50/30">
                            <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
                                <thead className="bg-[#174271] text-white">
                                    <tr>
                                        <th className="p-4 font-bold border-r border-blue-800/20">Loan (Account Number)</th>
                                        <th className="p-4 font-bold border-r border-blue-800/20">Amount</th>
                                        <th className="p-4 font-bold border-r border-blue-800/20">Method</th>
                                        <th className="p-4 font-bold border-r border-blue-800/20">Type</th>
                                        <th className="p-4 font-bold border-r border-blue-800/20">Status</th>
                                        <th className="p-4 font-bold text-center">Action</th>
                                    </tr>
                                </thead>
                                <FieldArray name="payments">
                                    {({ push, remove }) => (
                                        <tbody>
                                            {values.payments.map((payment, index) => (
                                                <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                                                    {/* Loan */}
                                                    <td className="p-2 border-r border-slate-200 min-w-[300px]">
                                                        <Select
                                                            onValueChange={(val) => setFieldValue(`payments.${index}.existing_loan`, val)}
                                                            value={payment.existing_loan}
                                                        >
                                                            <SelectTrigger className="h-9 border-slate-200">
                                                                <SelectValue placeholder="Select Loan" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {existingLoans?.map((loan) => (
                                                                    <SelectItem key={loan.reference} value={loan.account_number}>
                                                                        {loan.account_number} - {loan.member_name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>

                                                    {/* Amount */}
                                                    <td className="p-2 border-r border-slate-200">
                                                        <Input
                                                            type="number"
                                                            className="h-9 border-slate-200"
                                                            onChange={(e) => setFieldValue(`payments.${index}.amount`, e.target.value)}
                                                            value={payment.amount}
                                                        />
                                                    </td>

                                                    {/* Method */}
                                                    <td className="p-2 border-r border-slate-200 min-w-[150px]">
                                                        <Select
                                                            onValueChange={(val) => setFieldValue(`payments.${index}.payment_method`, val)}
                                                            value={payment.payment_method}
                                                        >
                                                            <SelectTrigger className="h-9 border-slate-200">
                                                                <SelectValue placeholder="Method" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {paymentAccounts?.map((pa) => (
                                                                    <SelectItem key={pa.reference} value={pa.name}>{pa.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </td>

                                                    {/* Type */}
                                                    <td className="p-2 border-r border-slate-200">
                                                        <Select onValueChange={(val) => setFieldValue(`payments.${index}.repayment_type`, val)} value={payment.repayment_type}>
                                                            <SelectTrigger className="h-9 border-slate-200"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Regular Repayment">Regular</SelectItem>
                                                                <SelectItem value="Partial Payment">Partial</SelectItem>
                                                                <SelectItem value="Early Settlement">Early</SelectItem>
                                                                <SelectItem value="Penalty Payment">Penalty</SelectItem>
                                                                <SelectItem value="Loan Clearance">Clearance</SelectItem>
                                                                <SelectItem value="Interest Only">Interest</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="p-2 border-r border-slate-200">
                                                        <Select onValueChange={(val) => setFieldValue(`payments.${index}.transaction_status`, val)} value={payment.transaction_status}>
                                                            <SelectTrigger className="h-9 border-slate-200"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Completed">Completed</SelectItem>
                                                                <SelectItem value="Pending">Pending</SelectItem>
                                                                <SelectItem value="Failed">Failed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>

                                                    {/* Remove */}
                                                    <td className="p-2 text-center">
                                                        {values.payments.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => remove(index)}
                                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    )}
                                </FieldArray>
                            </table>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => push(initialPayment)}
                                className="border-[#174271] text-[#174271] hover:bg-blue-50 font-bold px-6 h-12 flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add Row
                            </Button>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="font-bold px-8 h-12 text-slate-500 hover:bg-slate-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isCreating}
                                    className="bg-[#174271] hover:bg-[#12355a] text-white font-bold px-12 h-12 flex items-center gap-2 shadow-lg shadow-blue-100"
                                >
                                    {isSubmitting || isCreating ? "Saving Batch..." : "Onboard Payments"}
                                    <Save className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}
