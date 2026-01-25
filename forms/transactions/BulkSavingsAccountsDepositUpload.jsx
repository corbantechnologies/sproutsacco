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
import { Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { createBulkSavingsDeposits } from "@/services/savingsdeposits";

function BulkSavingsAccountsDepositUpload({
  isOpen,
  onClose,
  refetchTransactions,
}) {
  const token = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const handleBulkUpdate = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (values.file) {
        formData.append("file", values.file);
      }
      await createBulkSavingsDeposits(formData, token);
      toast.success("Bulk savings deposits uploaded successfully");
      refetchTransactions();
      onClose();
    } catch (error) {
      toast.error("Failed to upload bulk savings deposits. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">
            Bulk Savings Accounts Deposit Upload
          </DialogTitle>
        </DialogHeader>
        <Formik initialValues={{ file: null }} onSubmit={handleBulkUpdate}>
          {({ setFieldValue }) => (
            <Form>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="file" className="mb-3">
                    Upload CSV File
                  </Label>
                  <input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={(event) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                    }}
                    // className="mt-1"
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    CSV should include columns:{" "}
                    <code>&lt;Savings Type&gt; Account</code>,{" "}
                    <code>&lt;Savings Type&gt; Amount</code> (e.g., "Members
                    Contribution Account", "Members Contribution Amount",
                    "Holiday Savings Account", "Holiday Savings Amount").
                    Optional: <code>Payment Method</code> (defaults to "Cash").{" "}
                    <strong>You can reuse the same CSV multiple times.</strong>{" "}
                    Download the account list as a template.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-[#022007] text-white"
                >
                  {loading ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default BulkSavingsAccountsDepositUpload;
