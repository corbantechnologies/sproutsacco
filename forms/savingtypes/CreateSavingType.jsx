"use client";

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

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createSavingType } from "@/services/savingtypes";
import { Field, Form, Formik } from "formik";
import React, { useTransition } from "react";
import toast from "react-hot-toast";

const CreateSavingTypeModal = ({ isOpen, onClose, refetchSavingTypes }) => {
  const [loading, setLoading] = useTransition();
  const token = useAxiosAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">Create New Saving Type</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name: "",
            description: "",
            interest_rate: 0,
            can_guarantee: true,
          }}
          onSubmit={async (values) => {
            try {
              setLoading(async () => {
                await createSavingType(values, token);
                toast?.success("Saving type created successfully!");
                onClose();
                refetchSavingTypes();
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
                  className="border-black "
                  required
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
              <div className="flex items-center space-x-2">
                <Field
                  type="checkbox"
                  id="can_guarantee"
                  name="can_guarantee"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="can_guarantee" className="text-black">
                  Can be used as guarantee?
                </Label>
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
};

export default CreateSavingTypeModal;
