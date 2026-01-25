"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup";
import { updateLoanApplication } from "@/services/loanapplications"
import toast from "react-hot-toast"
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function MemberUpdateLoanApplication({ closeModal, reference, loanApplication, onSuccess }) {
    const token = useAxiosAuth()

    return (
        <Formik
            initialValues={{
                requested_amount: loanApplication?.requested_amount || "",
                term_months: loanApplication?.term_months || "",
                start_date: loanApplication?.start_date || "",
            }}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    await updateLoanApplication(reference, values, token)
                    toast.success("Loan application updated successfully! 🎊")
                    if (onSuccess) onSuccess();
                    closeModal()
                } catch (error) {
                    console.error(error);
                    toast.error("Loan application update failed! ❌")
                } finally {
                    setSubmitting(false)
                }
            }}
        >
            {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="requested_amount">Requested Amount (KES)</Label>
                        <Field as={Input}
                            id="requested_amount"
                            name="requested_amount"
                            type="number"
                            placeholder="e.g. 50000"
                            className={errors.requested_amount && touched.requested_amount ? "border-red-500" : ""}
                        />
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Field as={Input}
                            id="start_date"
                            name="start_date"
                            type="date"
                            className={errors.start_date && touched.start_date ? "border-red-500" : ""}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeModal}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#045e32] hover:bg-[#034625]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Application"
                            )}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}