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
import { Checkbox } from "@/components/ui/checkbox";

import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { updateGLAccount } from "@/services/glaccounts";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

const UpdateGLAccountModal = ({ isOpen, onClose, refetchGLAccounts, glAccount }) => {
    const [loading, setLoading] = useState(false);
    const token = useAxiosAuth();

    if (!glAccount) return null;

    const hasTransactions = glAccount?.has_transactions || false;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update GL Account: {glAccount?.name}</DialogTitle>
                </DialogHeader>
                <Formik
                    initialValues={{
                        name: glAccount?.name || "",
                        is_active: glAccount?.is_active ?? true,
                    }}
                    onSubmit={async (values) => {
                        try {
                            setLoading(true);
                            await updateGLAccount(glAccount?.id || glAccount?.reference, values, token);
                            toast?.success("GL Account updated successfully!");
                            onClose();
                            refetchGLAccounts();
                        } catch (error) {
                            toast?.error("Failed to update GL Account!");
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
                                    disabled={hasTransactions}
                                />
                                {hasTransactions && (
                                    <p className="text-xs text-muted-foreground">
                                        Name cannot be changed because this account has transactions.
                                    </p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-black">Category (Read-only)</Label>
                                <Input
                                    value={glAccount?.category}
                                    className="border-black bg-gray-50"
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-black">Code (Read-only)</Label>
                                <Input
                                    value={glAccount?.code}
                                    className="border-black bg-gray-50"
                                    disabled
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
                                    {loading ? "Updating..." : "Update"}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateGLAccountModal;