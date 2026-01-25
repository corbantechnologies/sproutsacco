"use client";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import React, { useTransition } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { Field, Form, Formik } from "formik";
import { createLoanProduct } from "@/services/loanproducts";
import toast from "react-hot-toast";

function CreateLoanProduct({ isOpen, onClose, refetchLoanTypes }) {
  const [loading, setLoading] = useTransition();
  const token = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">
            Create New Loan Type
          </DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name: "",
            description: "",
            interest_rate: 0,
          }}
          onSubmit={async (values) => {
            try {
              setLoading(async () => {
                await createLoanProduct(values, token);
                toast?.success("Saving type created successfully!");
                onClose();
                refetchLoanTypes();
              });
            } catch (error) {
              toast?.error("Failed to create saving type!");
            }
          }}
        >
          {({ values }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black">
                  Name
                </Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="border-black "
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest_rate" className="text-black">
                  Interest Rate (%)
                </Label>
                <Field
                  as={Input}
                  type="number"
                  id="interest_rate"
                  name="interest_rate"
                  className="border-black "
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-black">
                  Description
                </Label>
                <Field
                  as={Textarea}
                  rows={4}
                  id="description"
                  name="description"
                  className="border-black "
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-black text-black hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#ea1315] hover:bg-[#c71012] text-white"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLoanProduct;
