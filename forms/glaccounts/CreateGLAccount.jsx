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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createGLAccount } from "@/services/glaccounts";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CATEGORIES = [
    { value: "ASSET", label: "Asset" },
    { value: "LIABILITY", label: "Liability" },
    { value: "EQUITY", label: "Equity" },
    { value: "REVENUE", label: "Revenue" },
    { value: "EXPENSE", label: "Expense" },
];

const CreateGLAccountModal = ({ isOpen, onClose, refetchGLAccounts }) => {
    const [loading, setLoading] = useState(false);
    const token = useAxiosAuth();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New GL Account</DialogTitle>
                </DialogHeader>
                <Formik
                    initialValues={{
                        name: "",
                        category: "ASSET",
                        code: "",
                        is_active: true,
                    }}
                    onSubmit={async (values) => {
                        try {
                            setLoading(true);
                            await createGLAccount(values, token);
                            toast?.success("GL Account created successfully!");
                            onClose();
                            refetchGLAccounts();
                        } catch (error) {
                            toast?.error("Failed to create GL Account!");
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-black">
                                    Name
                                </Label>
                                <Field
                                    as={Input}
                                    id="name"
                                    name="name"
                                    className="border-black"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-black">
                                    Category
                                </Label>
                                <Select
                                    value={values.category}
                                    onValueChange={(value) => setFieldValue("category", value)}
                                >
                                    <SelectTrigger className="border-black">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-black">
                                    Code
                                </Label>
                                <Field
                                    as={Input}
                                    id="code"
                                    name="code"
                                    className="border-black"
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={values.is_active}
                                    onCheckedChange={(checked) => setFieldValue("is_active", checked)}
                                />
                                <Label htmlFor="is_active" className="text-black">
                                    Is Active?
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

export default CreateGLAccountModal;
