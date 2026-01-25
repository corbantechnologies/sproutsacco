"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions"
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth"
import { useState } from "react"
import { createLoanApplication } from "@/services/loanapplications"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Loader2 } from "lucide-react"

// Validation Schema
const LoanApplicationSchema = Yup.object().shape({
    product: Yup.string().required("Loan Product is required"),
    requested_amount: Yup.number()
        .positive("Amount must be positive")
        .required("Requested amount is required"),
    term_months: Yup.number()
        .positive("Term must be positive")
        .integer("Term must be an integer")
        .required("Loan term is required"),
    start_date: Yup.date()
        .required("Start Date is required")
        .min(new Date(), "Start Date cannot be in the past"),
    repayment_frequency: Yup.string().required("Repayment frequency is required"),
});

export function CreateLoanApplication({ onSuccess, memberPath }) {
    const { data: loanProducts, isLoading: productsLoading } = useFetchLoanProducts()
    const token = useAxiosAuth()
    const router = useRouter()

    if (productsLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
    }

    const availableProducts = loanProducts

    return (
        <Formik
            initialValues={{
                product: "",
                requested_amount: "",
                term_months: "",
                repayment_frequency: "monthly",
                start_date: "",
            }}
            validationSchema={LoanApplicationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const response = await createLoanApplication(values, token)
                    toast.success("Loan application submitted successfully! 🎊")
                    router.push(`/${memberPath}/loan-applications/${response?.reference}`)
                    if (onSuccess) onSuccess();
                } catch (error) {
                    console.error("Loan application error:", error?.response?.data?.requested_amount[0]);
                    if (error?.response?.data?.requested_amount[0]) {
                        toast.error(error?.response?.data?.requested_amount[0])
                    }else{
                        toast.error("Process failed. Please try again.")
                    }

                } finally {
                    setSubmitting(false)
                }
            }}
        >
            {({ isSubmitting, setFieldValue, values, errors, touched }) => (
                <Form className="space-y-5">

                    {/* Loan Product Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="product">Loan Product</Label>
                        <Field
                            as="select"
                            name="product"
                            id="product"
                            className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.product && touched.product ? "border-red-500" : ""}`}
                        >
                            <option value="" disabled>Select a loan product</option>
                            {availableProducts.map((product) => (
                                <option key={product?.reference} value={product?.name}>
                                    {product?.name} ({product?.interest_rate}% p.a)
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage name="product" component="div" className="text-red-500 text-xs" />
                    </div>

                    {/* Amount & Term Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="requested_amount">Amount (KES)</Label>
                            <Field as={Input}
                                id="requested_amount"
                                name="requested_amount"
                                type="number"
                                placeholder="e.g. 50000"
                                className={errors.requested_amount && touched.requested_amount ? "border-red-500" : ""}
                            />
                            <ErrorMessage name="requested_amount" component="div" className="text-red-500 text-xs" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="term_months">Term (Months)</Label>
                            <Field as={Input}
                                id="term_months"
                                name="term_months"
                                type="number"
                                placeholder="e.g. 12"
                                className={errors.term_months && touched.term_months ? "border-red-500" : ""}

                            />
                            <ErrorMessage name="term_months" component="div" className="text-red-500 text-xs" />
                        </div>
                    </div>

                    {/* Frequency & Start Date Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="repayment_frequency">Repayment Frequency</Label>
                            <Field
                                as="select"
                                name="repayment_frequency"
                                id="repayment_frequency"
                                className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.repayment_frequency && touched.repayment_frequency ? "border-red-500" : ""}`}
                            >
                                <option value="" disabled>Select Frequency</option>
                                <option value="monthly">Monthly</option>
                            </Field>
                            <ErrorMessage name="repayment_frequency" component="div" className="text-red-500 text-xs" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Field as={Input}
                                id="start_date"
                                name="start_date"
                                type="date"
                                className={errors.start_date && touched.start_date ? "border-red-500" : ""}
                            />
                            <ErrorMessage name="start_date" component="div" className="text-red-500 text-xs" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#045e32] hover:bg-[#034625] w-full md:w-auto"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Application"
                            )}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}