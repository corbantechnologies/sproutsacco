"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createBulkMembers } from "@/services/members";
import { Field, Form, Formik, FieldArray } from "formik";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

function BulkMemberCreate({ closeModal, openModal }) {
    const [loading, setLoading] = useState(false);
    // We'll track password visibility per member index
    const [showPassword, setShowPassword] = useState({});
    const token = useAxiosAuth();
    const router = useRouter();

    const togglePasswordVisibility = (index) => {
        setShowPassword((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const emptyMember = {
        first_name: "",
        last_name: "",
        email: "",
        employer: "",
        payroll_no: "",
        phone: "",
        gender: "",
        password: "",
    };

    return (
        <Dialog open={openModal} onOpenChange={closeModal}>
            <DialogContent className="w-full max-w-5xl h-[90vh] sm:h-auto max-h-[90vh] p-4 sm:p-6 bg-white overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold ">
                        Bulk Create Members (Max 15)
                    </DialogTitle>
                </DialogHeader>

                <Formik
                    initialValues={{
                        members: [emptyMember],
                    }}
                    onSubmit={async (values) => {
                        try {
                            setLoading(true);
                            const response = await createBulkMembers(values.members, token);
                            toast?.success("Members created successfully!");
                            closeModal();
                            // You could refresh the page or list here
                            router.refresh();
                        } catch (error) {
                            toast?.error("Failed to create members!");
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    {({ values }) => (
                        <Form className="space-y-6">
                            <FieldArray
                                name="members"
                                render={(arrayHelpers) => (
                                    <div className="space-y-6">
                                        {values.members.map((member, index) => (
                                            <div
                                                key={index}
                                                className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-semibold text-lg text-gray-700">
                                                        Member #{index + 1}
                                                    </h4>
                                                    {values.members.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => arrayHelpers.remove(index)}
                                                            variant="ghost"
                                                            className="text-red-500 hover:text-red-700 p-2 h-auto"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`members.${index}.first_name`}
                                                            className="text-base text-black font-medium"
                                                        >
                                                            First Name
                                                        </Label>
                                                        <Field
                                                            as={Input}
                                                            type="text"
                                                            name={`members.${index}.first_name`}
                                                            id={`members.${index}.first_name`}
                                                            placeholder="John"
                                                            className="border-black rounded-md text-base py-2"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`members.${index}.last_name`}
                                                            className="text-base text-black font-medium"
                                                        >
                                                            Last Name
                                                        </Label>
                                                        <Field
                                                            as={Input}
                                                            type="text"
                                                            name={`members.${index}.last_name`}
                                                            id={`members.${index}.last_name`}
                                                            placeholder="Doe"
                                                            className="border-black rounded-md text-base py-2"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`members.${index}.gender`}
                                                            className="text-base text-black font-medium"
                                                        >
                                                            Gender
                                                        </Label>
                                                        <Field
                                                            as="select"
                                                            name={`members.${index}.gender`}
                                                            id={`members.${index}.gender`}
                                                            className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 transition-colors bg-white h-10"
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                        </Field>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`members.${index}.employer`}
                                                            className="text-base text-black font-medium"
                                                        >
                                                            Employer
                                                        </Label>
                                                        <Field
                                                            as="select"
                                                            name={`members.${index}.employer`}
                                                            id={`members.${index}.employer`}
                                                            className="w-full border border-black rounded-md px-3 py-2 text-base focus:ring-2 transition-colors bg-white h-10"
                                                        >
                                                            <option value="">Select Employer</option>
                                                            <option value="Tamarind Management Limited">
                                                                Tamarind Management Limited
                                                            </option>
                                                            <option value="Other">Other</option>
                                                        </Field>
                                                    </div>

                                                    {member.employer === "Tamarind Management Limited" && (
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`members.${index}.payroll_no`}
                                                                className="text-base text-black font-medium"
                                                            >
                                                                Payroll Number
                                                            </Label>
                                                            <Field
                                                                as={Input}
                                                                type="text"
                                                                name={`members.${index}.payroll_no`}
                                                                id={`members.${index}.payroll_no`}
                                                                placeholder="e.g. 12345"
                                                                className="border-black rounded-md text-base py-2"
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`members.${index}.phone`}
                                                            className="text-base text-black font-medium"
                                                        >
                                                            Phone
                                                        </Label>
                                                        <Field
                                                            as={Input}
                                                            type="text"
                                                            name={`members.${index}.phone`}
                                                            id={`members.${index}.phone`}
                                                            placeholder="254700000000"
                                                            className="border-black rounded-md text-base py-2"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`members.${index}.email`}
                                                            className="text-base text-black font-medium"
                                                        >
                                                            Email
                                                        </Label>
                                                        <Field
                                                            as={Input}
                                                            type="email"
                                                            name={`members.${index}.email`}
                                                            id={`members.${index}.email`}
                                                            placeholder="jdoe@example.com"
                                                            className="border-black rounded-md text-base py-2"
                                                        />
                                                    </div>

                                                    {/* if no email provided, show the password input */}
                                                    {member.email === "" && (
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor={`members.${index}.password`}
                                                                className="text-base text-black font-medium"
                                                            >
                                                                Password
                                                            </Label>
                                                            <div className="relative">
                                                                <Field
                                                                    as={Input}
                                                                    type={showPassword[index] ? "text" : "password"}
                                                                    name={`members.${index}.password`}
                                                                    id={`members.${index}.password`}
                                                                    placeholder="Enter password"
                                                                    className="border-black rounded-md text-base py-2"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                                    onClick={() => togglePasswordVisibility(index)}
                                                                >
                                                                    {showPassword[index] ? (
                                                                        <EyeOff className="w-4 h-4 text-gray-500" />
                                                                    ) : (
                                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                                    )}
                                                                    <span className="sr-only">
                                                                        {showPassword[index] ? "Hide password" : "Show password"}
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {values.members.length < 15 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => arrayHelpers.push(emptyMember)}
                                                className="w-full border-dashed border-2 border-gray-300 text-gray-500 hover:text-black hover:border-black hover:bg-gray-50 flex items-center justify-center gap-2 py-6 text-base"
                                            >
                                                <Plus className="w-5 h-5" /> Add Another Member
                                            </Button>
                                        )}
                                    </div>
                                )}
                            />

                            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 border-t pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeModal}
                                    className="border-black text-black hover:bg-gray-100 text-base py-2 px-4 w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[#ea1315] hover:bg-[#c71012] text-white text-base py-2 px-4 w-full sm:w-auto"
                                    disabled={loading || values.members.length === 0}
                                >
                                    {loading ? "Creating..." : "Create Members"}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}

export default BulkMemberCreate;