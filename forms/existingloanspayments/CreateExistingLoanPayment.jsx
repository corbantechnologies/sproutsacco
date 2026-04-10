"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
import { useCreateExistingLoanPayment } from "@/hooks/existingloanpayments/actions";
import { useFetchExistingLoans } from "@/hooks/existingloans/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import toast from "react-hot-toast";

const validationSchema = Yup.object().shape({
    existing_loan: Yup.string().required("Existing Loan is required"),
    payment_method: Yup.string().required("Payment method is required"),
    amount: Yup.number().positive("Amount must be positive").required("Required"),
    repayment_type: Yup.string().required("Repayment type is required"),
    transaction_status: Yup.string().required("Status is required"),
});

export default function CreateExistingLoanPayment({ isOpen, onClose, initialLoanAcc = "" }) {
    const { mutate: createPayment, isLoading: isCreating } = useCreateExistingLoanPayment();
    const { data: existingLoans, isLoading: isLoadingLoans } = useFetchExistingLoans();
    const { data: paymentAccounts, isLoading: isLoadingPayments } = useFetchPaymentAccounts();

    const handleSubmit = (values, { setSubmitting }) => {
        createPayment(values, {
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
            title="Record Historical Loan Payment"
            description="Record a payment made towards an onboarded existing loan."
            maxWidth="max-w-4xl"
        >
            <Formik
                initialValues={{
                    existing_loan: initialLoanAcc,
                    payment_method: "",
                    repayment_type: "Regular Repayment",
                    amount: "",
                    transaction_status: "Completed",
                }}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Loan Selection (By Account Number as requested) */}
                            <div className="space-y-2">
                                <Label className="text-[#174271] font-semibold">Select Loan (Account Number)</Label>
                                <Select
                                    onValueChange={(val) => setFieldValue("existing_loan", val)}
                                    value={values.existing_loan}
                                >
                                    <SelectTrigger className="border-slate-300">
                                        <SelectValue placeholder={isLoadingLoans ? "Loading..." : "Select Loan"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {existingLoans?.map((loan) => (
                                            <SelectItem key={loan.reference} value={loan.account_number}>
                                                {loan.account_number} - {loan.member_name} (KES {loan.outstanding_balance})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.existing_loan && touched.existing_loan && <p className="text-red-500 text-xs">{errors.existing_loan}</p>}
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-2">
                                <Label className="text-[#174271] font-semibold">Payment Method</Label>
                                <Select
                                    onValueChange={(val) => setFieldValue("payment_method", val)}
                                    value={values.payment_method}
                                >
                                    <SelectTrigger className="border-slate-300">
                                        <SelectValue placeholder={isLoadingPayments ? "Loading..." : "Select Method"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paymentAccounts?.map((pa) => (
                                            <SelectItem key={pa.reference} value={pa.name}>
                                                {pa.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Amount */}
                            <div className="space-y-2">
                                <Label className="text-[#174271] font-semibold">Paid Amount</Label>
                        <Field
                            as={Input}
                            type="number"
                            name="amount"
                            className="border-slate-300 rounded"
                        />
                                {errors.amount && touched.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
                            </div>

                            {/* Repayment Type */}
                            <div className="space-y-2">
                                <Label className="text-[#174271] font-semibold">Repayment Type</Label>
                                <Select
                                    onValueChange={(val) => setFieldValue("repayment_type", val)}
                                    value={values.repayment_type}
                                >
                                    <SelectTrigger className="border-slate-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Regular Repayment">Regular Repayment</SelectItem>
                                        <SelectItem value="Partial Payment">Partial Payment</SelectItem>
                                        <SelectItem value="Early Settlement">Early Settlement</SelectItem>
                                        <SelectItem value="Penalty Payment">Penalty Payment</SelectItem>
                                        <SelectItem value="Loan Clearance">Loan Clearance</SelectItem>
                                        <SelectItem value="Interest Only">Interest Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Transaction Status */}
                            <div className="space-y-2">
                                <Label className="text-[#174271] font-semibold">Transaction Status</Label>
                                <Select
                                    onValueChange={(val) => setFieldValue("transaction_status", val)}
                                    value={values.transaction_status}
                                >
                                    <SelectTrigger className="border-slate-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="border-slate-200 text-slate-600 font-semibold px-8 h-12 rounded"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isCreating}
                                className="bg-[#174271] hover:bg-[#12355a] text-white font-semibold px-12 h-12 shadow-sm rounded"
                            >
                                {isSubmitting || isCreating ? "Saving..." : "Record Payment"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}
