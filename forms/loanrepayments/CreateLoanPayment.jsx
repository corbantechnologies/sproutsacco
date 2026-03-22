"use client";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, Form, Formik } from "formik";
import { createLoanRepayment } from "@/services/loanrepayments";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import toast from "react-hot-toast";

const REPAYMENT_TYPE_CHOICES = [
  { value: "Regular Repayment", label: "Regular Repayment" },
  { value: "Interest Payment", label: "Interest Payment" },
  { value: "Individual Settlement", label: "Individual Settlement" },
  { value: "Early Settlement", label: "Early Settlement" },
  { value: "Partial Payment", label: "Partial Payment" },
];

function CreateLoanPayment({ isOpen, onClose, refetchLoan, loan_account, maxAmount }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();
  const { data: paymentAccounts, isLoading: isLoadingPayment } = useFetchPaymentAccounts();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Loan Repayment</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            loan_account: loan_account || "",
            amount: 0,
            payment_method: "",
            repayment_type: "Regular Repayment",
            transaction_status: "Completed",
          }}
          onSubmit={async (values) => {
            if (values.amount > maxAmount) {
              toast.error(`Amount cannot exceed the remaining balance of ${maxAmount.toLocaleString()}`);
              return;
            }
            setLoading(true);
            try {
              await createLoanRepayment(values, token);
              toast?.success("Repayment logged successfully!");
              onClose();
              if (refetchLoan) refetchLoan();
            } catch (error) {
              toast?.error("Failed to log repayment!");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loan_account" className="text-black">
                  Loan Account
                </Label>
                <Field
                  as={Input}
                  id="loan_account"
                  name="loan_account"
                  className="border-black bg-gray-50"
                  readOnly
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-black">
                  Amount
                </Label>
                <Field
                  as={Input}
                  type="number"
                  id="amount"
                  name="amount"
                  className="border-black"
                  placeholder="Enter repayment amount"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method" className="text-black">
                  Payment Method
                </Label>
                <Select
                  value={values.payment_method}
                  onValueChange={(value) => setFieldValue("payment_method", value)}
                  disabled={isLoadingPayment}
                  required
                >
                  <SelectTrigger className="border-black w-full">
                    <SelectValue
                      placeholder={
                        isLoadingPayment ? "Loading..." : "Select payment method"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentAccounts?.map((method) => (
                      <SelectItem key={method.id || method.reference} value={method.name}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repayment_type" className="text-black">
                  Repayment Type
                </Label>
                <Select
                  value={values.repayment_type}
                  onValueChange={(value) => setFieldValue("repayment_type", value)}
                  required
                >
                  <SelectTrigger className="border-black w-full">
                    <SelectValue placeholder="Select repayment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPAYMENT_TYPE_CHOICES.map((choice) => (
                      <SelectItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="bg-primary hover:bg-[#022007] text-white"
                >
                  {loading ? "Logging..." : "Log Repayment"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLoanPayment;