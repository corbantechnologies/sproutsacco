// This will be a modal form inside the loan application details page
// It is used to update the loan application details by the admin
// Admin cannot update their own loan application
// Only available when the loan application is in the Ready for Amendment stage
// Limited to the fields that can be updated by the admin
// The admin is required to write an amendment note whether the loan application is changed or not
// The admin can only update the requested amount

"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { amendLoanApplication } from "@/services/loanapplications"
import toast from "react-hot-toast"
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

const AmendLoanSchema = Yup.object().shape({
    requested_amount: Yup.number()
        .positive("Amount must be positive")
        .required("Requested amount is required"),
    amendment_note: Yup.string()
        .required("Amendment note is required to explain the changes (or lack thereof)."),
});

export function AdminAmendLoanApplication({ closeModal, reference, loanApplication, onSuccess }) {
    const token = useAxiosAuth()

    return (
        <Formik
            initialValues={{
                requested_amount: loanApplication?.requested_amount || "",
                amendment_note: "",
            }}
            validationSchema={AmendLoanSchema}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    await amendLoanApplication(reference, values, token)
                    toast.success("Loan application amended successfully! 🎊")
                    if (onSuccess) onSuccess()
                    closeModal()
                } catch (error) {
                    console.error("Amendment failed", error)
                    toast.error("Failed to amend loan application. ❌")
                } finally {
                    setSubmitting(false)
                }
            }}
        >
            {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="requested_amount">Requested Amount (KES)</Label>
                        <Field
                            as={Input}
                            id="requested_amount"
                            name="requested_amount"
                            type="number"
                            placeholder="e.g. 50000"
                            className={errors.requested_amount && touched.requested_amount ? "border-red-500" : ""}
                        />
                        <ErrorMessage name="requested_amount" component="div" className="text-red-500 text-xs" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amendment_note">Amendment Note</Label>
                        <Field
                            as="textarea"
                            id="amendment_note"
                            name="amendment_note"
                            placeholder="Explain the reason for amendment or approval..."
                            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.amendment_note && touched.amendment_note ? "border-red-500" : ""}`}
                        />
                        <ErrorMessage name="amendment_note" component="div" className="text-red-500 text-xs" />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#045e32] hover:bg-[#034625]" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Amendment"
                            )}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}