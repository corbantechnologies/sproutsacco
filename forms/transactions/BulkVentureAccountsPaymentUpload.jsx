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
import { Label } from "@/components/ui/label";
import { Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { createBulkVenturePayments } from "@/services/venturepayments";

function BulkVentureAccountsPaymentUpload({
  isOpen,
  onClose,
  refetchTransactions,
}) {
  const token = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const handleBulkUpdate = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (values.file) {
        formData.append("file", values.file);
      }
      await createBulkVenturePayments(formData, token);
      toast.success("Bulk venture payments uploaded successfully");
      resetForm();
      refetchTransactions();
      onClose();
    } catch (error) {
      toast.error("Failed to upload bulk venture payments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">
            Bulk Venture Accounts Payment Upload
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
                    disabled={loading}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    CSV should include columns for each venture type, e.g.,{" "}
                    <code>&lt;Venture Type&gt; Account</code>,{" "}
                    <code>&lt;Venture Type&gt; Payment Amount</code> (like
                    "Venture A Account", "Venture A Payment Amount"). Optional:{" "}
                    <code>Payment Method</code> (defaults to "Cash"),{" "}
                    <code>Payment Type</code> (defaults to "Individual
                    Settlement").{" "}
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

export default BulkVentureAccountsPaymentUpload;
