"use client";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import React, { useState, useTransition } from "react";
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
import { Field, Form, Formik } from "formik";
import { createSavingsDeposit } from "@/services/savingsdeposits";
import toast from "react-hot-toast";

function CreateDepositAdmin({ isOpen, onClose, refetchMember, accounts }) {
  const [loading, setLoading] = useState(false);
  const token = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">
            Create New Savings Deposit
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            savings_account: accounts?.savings_account || "",
            amount: 0,
            description: "",
            payment_method: "",
            deposit_type: "",
            transaction_status: "Completed",
            is_active: true,
          }}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              await createSavingsDeposit(values, token);
              toast?.success("Deposit created successfully!");
              onClose();
              refetchMember();
            } catch (error) {
              toast?.error("Failed to create deposit!");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="savings_account" className="text-black">
                  Member Savings Account
                </Label>
                <Field
                  as="select"
                  name="savings_account"
                  className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2   transition-colors"
                >
                  <option value="" label="Select account" />
                  {accounts?.map((account) => (
                    <option
                      key={account.reference}
                      value={account.account_number}
                    >
                      {account.account_number} - {account.account_type}
                    </option>
                  ))}
                </Field>
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
                  className="border-black "
                  placeholder="Enter deposit amount"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method" className="text-black">
                  Payment Method
                </Label>
                <Field
                  as="select"
                  name="payment_method"
                  className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2   transition-colors"
                  required
                >
                  <option value="" label="Select payment method" />
                  <option value="Cash">Cash</option>
                  <option value="Mpesa">Mpesa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                  <option value="Standing Order">Standing Order</option>
                </Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit_type" className="text-black">
                  Deposit Type
                </Label>
                <Field
                  as="select"
                  name="deposit_type"
                  className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2   transition-colors"
                  required
                >
                  <option value="" label="Select deposit type" />
                  <option value="Opening Balance">Opening Balance</option>
                  <option value="Payroll Deduction">Payroll Deduction</option>
                  <option value="Group Deposit">Group Deposit</option>
                  <option value="Dividend Deposit">Dividend Deposit</option>
                  <option value="Member Deposit">Member Deposit</option>
                  <option value="Other">Other</option>
                </Field>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  size={"sm"}
                  disabled={loading}
                  className="bg-primary hover:bg-[#022007] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
                >
                  {loading ? "Depositing..." : "Deposit"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDepositAdmin;
