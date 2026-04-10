"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
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
import { useCreateExistingLoan } from "@/hooks/existingloans/actions";
import { useFetchMembers } from "@/hooks/members/actions";
import { useFetchGLAccounts } from "@/hooks/glaccounts/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import toast from "react-hot-toast";



export default function CreateExistingLoan({ isOpen, onClose }) {
    const { mutate: createLoan, isLoading: isCreating } = useCreateExistingLoan();
    const { data: members, isLoading: isLoadingMembers } = useFetchMembers();
    const { data: glAccounts, isLoading: isLoadingGL } = useFetchGLAccounts();
    const { data: paymentAccounts, isLoading: isLoadingPayments } = useFetchPaymentAccounts();

    const handleSubmit = (values, { setSubmitting }) => {
        createLoan(values, {
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
            title="Onboard Existing Loan"
            description="Manually add a loan from a legacy system. Ensure all balances are accurate."
            maxWidth="max-w-6xl" // Full width as requested
        >
            <Formik
                initialValues={{
                    member: "",
                    payment_method: "",
                    principal: "",
                    gl_principal_asset: "",
                    gl_interest_revenue: "",
                    gl_penalty_revenue: "",
                }}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, errors, touched, isSubmitting }) => {
                    return (
                        <Form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Member Selection */}
                                <div className="space-y-2">
                                    <Label className="text-[#174271] font-bold">Member (Member No)</Label>
                                    <Select
                                        onValueChange={(val) => setFieldValue("member", val)}
                                        value={values.member}
                                    >
                                        <SelectTrigger className="border-slate-300 focus:ring-[#174271]">
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
                                </div>



                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* Principal */}
                                <div className="space-y-2">
                                    <Label className="text-[#174271] font-bold">Principal Amount</Label>
                                    <Field
                                        as={Input}
                                        type="number"
                                        name="principal"
                                        className="border-slate-300"
                                    />
                                </div>

                                {/* Payment Method */}
                                <div className="space-y-2">
                                    <Label className="text-[#174271] font-bold">Initial Payment Method</Label>
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

                            <hr className="border-slate-100" />
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">GL Account Mapping</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* GL Principal Asset */}
                                <div className="space-y-2">
                                    <Label className="text-[#174271] font-bold">GL Principal Asset</Label>
                                    <Select
                                        onValueChange={(val) => setFieldValue("gl_principal_asset", val)}
                                        value={values.gl_principal_asset}
                                    >
                                        <SelectTrigger className="border-slate-300">
                                            <SelectValue placeholder="Select GL" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {glAccounts?.map((acc) => (
                                                <SelectItem key={acc.reference} value={acc.name}>
                                                    {acc.name} ({acc.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* GL Interest Revenue */}
                                <div className="space-y-2">
                                    <Label className="text-[#174271] font-bold">GL Interest Revenue</Label>
                                    <Select
                                        onValueChange={(val) => setFieldValue("gl_interest_revenue", val)}
                                        value={values.gl_interest_revenue}
                                    >
                                        <SelectTrigger className="border-slate-300">
                                            <SelectValue placeholder="Select GL" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {glAccounts?.map((acc) => (
                                                <SelectItem key={acc.reference} value={acc.name}>
                                                    {acc.name} ({acc.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* GL Penalty Revenue */}
                                <div className="space-y-2">
                                    <Label className="text-[#174271] font-bold">GL Penalty Revenue</Label>
                                    <Select
                                        onValueChange={(val) => setFieldValue("gl_penalty_revenue", val)}
                                        value={values.gl_penalty_revenue}
                                    >
                                        <SelectTrigger className="border-slate-300">
                                            <SelectValue placeholder="Select GL" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {glAccounts?.map((acc) => (
                                                <SelectItem key={acc.reference} value={acc.name}>
                                                    {acc.name} ({acc.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="border-slate-200 text-slate-600 font-bold px-8 h-12"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isCreating}
                                    className="bg-[#174271] hover:bg-[#12355a] text-white font-bold px-12 h-12 shadow-lg shadow-blue-100"
                                >
                                    {isSubmitting || isCreating ? "Onboarding..." : "Onboard Loan"}
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </Modal>
    );
}
