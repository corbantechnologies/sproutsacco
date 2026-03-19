"use client";

import React, { useState } from "react";
import { useFetchMember, useFetchMembers } from "@/hooks/members/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
import { useFetchVentureTypes } from "@/hooks/venturetypes/actions";
import { useFetchGLAccounts } from "@/hooks/glaccounts/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import { useFetchFeeTypes } from "@/hooks/feetypes/actions";

import CreateGLAccountModal from "@/forms/glaccounts/CreateGLAccount";
import CreatePaymentAccountModal from "@/forms/paymentaccounts/CreatePaymentAccount";
import CreateSavingTypeModal from "@/forms/savingtypes/CreateSavingType";
// Assuming other modals exist or will be implemented similarly
// import CreateLoanProductModal from "@/forms/loanproducts/CreateLoanProduct";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    CheckCircle2, 
    Circle, 
    ArrowRight, 
    Building2, 
    Wallet, 
    PiggyBank, 
    HandCoins, 
    Users, 
    Settings2,
    AlertCircle
} from "lucide-react";

export default function SetupPage() {
    const { data: myself, isLoading: isLoadingMyself } = useFetchMember();
    const {
        data: glaccounts,
        isLoading: isLoadingGLAccounts,
        refetch: refetchGLAccounts
    } = useFetchGLAccounts();
    const {
        data: paymentaccounts,
        isLoading: isLoadingPaymentAccounts,
        refetch: refetchPaymentAccounts
    } = useFetchPaymentAccounts();
    const {
        data: feetypes,
        isLoading: isLoadingFeeTypes,
        refetch: refetchFeeTypes
    } = useFetchFeeTypes();
    const {
        data: members,
        isLoading: isLoadingMembers,
        refetch: refetchMembers,
    } = useFetchMembers();
    const {
        data: savingTypes,
        isLoading: isLoadingSavingTypes,
        refetch: refetchSavingTypes,
    } = useFetchSavingsTypes();
    const {
        data: loanProducts,
        isLoading: isLoadingLoanProducts,
        refetch: refetchLoanProducts,
    } = useFetchLoanProducts();
    const {
        data: ventureTypes,
        isLoading: isLoadingVentureTypes,
        refetch: refetchVentureTypes,
    } = useFetchVentureTypes();

    const [createGLAccountOpen, setCreateGLAccountOpen] = useState(false);
    const [createPaymentAccountOpen, setCreatePaymentAccountOpen] = useState(false);
    const [createMemberOpen, setCreateMemberOpen] = useState(false);
    const [bulkMemberCreateOpen, setBulkMemberCreateOpen] = useState(false);
    const [bulkMemberUploadOpen, setBulkMemberUploadOpen] = useState(false);
    const [memberPopoverOpen, setMemberPopoverOpen] = useState(false);
    const [createSavingTypeOpen, setCreateSavingTypeOpen] = useState(false);
    const [createLoanProductOpen, setCreateLoanProductOpen] = useState(false);
    const [createVentureTypeOpen, setCreateVentureTypeOpen] = useState(false);
    const [createFeeTypeOpen, setCreateFeeTypeOpen] = useState(false);

    const glSetupDone = glaccounts?.length > 0;
    const paymentSetupDone = paymentaccounts?.length > 0;
    const mandatorySetupDone = glSetupDone && paymentSetupDone;

    const setupSteps = [
        {
            title: "GL Accounts",
            description: "Define your General Ledger chart of accounts.",
            icon: Building2,
            done: glSetupDone,
            onClick: () => setCreateGLAccountOpen(true),
            mandatory: true,
        },
        {
            title: "Payment Accounts",
            description: "Configure bank and cash accounts linked to GL.",
            icon: Wallet,
            done: paymentSetupDone,
            onClick: () => setCreatePaymentAccountOpen(true),
            mandatory: true,
            disabled: !glSetupDone,
        },
        {
            title: "Savings Products",
            description: "Define different types of savings accounts.",
            icon: PiggyBank,
            done: savingTypes?.length > 0,
            onClick: () => setCreateSavingTypeOpen(true),
            disabled: !mandatorySetupDone,
        },
        {
            title: "Loan Products",
            description: "Set up various loan facilities and terms.",
            icon: HandCoins,
            done: loanProducts?.length > 0,
            onClick: () => setCreateLoanProductOpen(true),
            disabled: !mandatorySetupDone,
        },
        {
            title: "Member Registration",
            description: "Start adding members to the SACCO.",
            icon: Users,
            done: members?.length > 0,
            onClick: () => setCreateMemberOpen(true),
            disabled: !mandatorySetupDone,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        SACCO Setup
                    </h1>
                    <p className="text-slate-500 mt-1 text-lg">
                        Configure key system parameters to get started
                    </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-full border shadow-sm">
                    <p className="text-sm font-medium text-gray-900">
                        {myself?.salutation} {myself?.last_name} (Admin)
                    </p>
                </div>
            </div>

            {!mandatorySetupDone && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-bold text-amber-900">Initial Setup Required</h3>
                        <p className="text-sm text-amber-700">
                            You must configure at least one GL Account and one Payment Account before you can set up products or add members.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {setupSteps.map((step, idx) => (
                    <Card key={idx} className={`${step.disabled ? "opacity-60 grayscale-[0.5]" : "hover:shadow-md transition-shadow"}`}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className={`p-2 rounded-md ${step.done ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                {step.done ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-300" />
                                )}
                            </div>
                            <CardTitle className="mt-4">{step.title}</CardTitle>
                            <CardDescription>{step.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={step.onClick} 
                                disabled={step.disabled}
                                className={`w-full ${step.done ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-[#ea1315] text-white hover:bg-[#c71012]"}`}
                                variant={step.done ? "secondary" : "default"}
                            >
                                {step.done ? "Add Another" : "Configure Now"}
                                {!step.done && <ArrowRight className="ml-2 w-4 h-4" />}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modals */}
            <CreateGLAccountModal 
                isOpen={createGLAccountOpen} 
                onClose={() => setCreateGLAccountOpen(false)} 
                refetchGLAccounts={refetchGLAccounts} 
            />
            <CreatePaymentAccountModal 
                isOpen={createPaymentAccountOpen} 
                onClose={() => setCreatePaymentAccountOpen(false)} 
                refetchPaymentAccounts={refetchPaymentAccounts} 
            />
            <CreateSavingTypeModal
                isOpen={createSavingTypeOpen}
                onClose={() => setCreateSavingTypeOpen(false)}
                refetchSavingTypes={refetchSavingTypes}
            />
            {/* Add other modals as they are implemented */}
        </div>
    );
}