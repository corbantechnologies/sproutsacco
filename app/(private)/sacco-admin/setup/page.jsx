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
import CreateLoanProduct from "@/forms/loanproducts/CreateLoanProduct";
import CreateVentureType from "@/forms/venturetypes/CreateVentureType";
import CreateFeeTypeModal from "@/forms/feetypes/CreateFeeType";
import CreateMember from "@/forms/members/CreateMember";

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
    AlertCircle,
    BadgePercent,
    Briefcase
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
            description: "Define General Ledger chart of accounts.",
            icon: Building2,
            done: glSetupDone,
            onClick: () => setCreateGLAccountOpen(true),
            mandatory: true,
        },
        {
            title: "Payment Accounts",
            description: "Configure bank and cash accounts.",
            icon: Wallet,
            done: paymentSetupDone,
            onClick: () => setCreatePaymentAccountOpen(true),
            mandatory: true,
            disabled: !glSetupDone,
        },
        {
            title: "Fee Types",
            description: "Define various SACCO fee structures.",
            icon: BadgePercent,
            done: feetypes?.length > 0,
            onClick: () => setCreateFeeTypeOpen(true),
            disabled: !mandatorySetupDone,
        },
        {
            title: "Savings Products",
            description: "Define types of savings accounts.",
            icon: PiggyBank,
            done: savingTypes?.length > 0,
            onClick: () => setCreateSavingTypeOpen(true),
            disabled: !mandatorySetupDone,
        },
        {
            title: "Loan Products",
            description: "Set up loan facilities and terms.",
            icon: HandCoins,
            done: loanProducts?.length > 0,
            onClick: () => setCreateLoanProductOpen(true),
            disabled: !mandatorySetupDone,
        },
        {
            title: "Venture Types",
            description: "Configure investment venture types.",
            icon: Briefcase,
            done: ventureTypes?.length > 0,
            onClick: () => setCreateVentureTypeOpen(true),
            disabled: !mandatorySetupDone,
        },
        {
            title: "Member Registration",
            description: "Add members to the SACCO system.",
            icon: Users,
            done: members?.length > 0,
            onClick: () => setCreateMemberOpen(true),
            disabled: !mandatorySetupDone,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        SACCO Setup
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Efficiently configure your system parameters
                    </p>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-full border shadow-sm">
                    <p className="text-xs font-semibold text-gray-900">
                        {myself?.salutation} {myself?.last_name} (Admin)
                    </p>
                </div>
            </div>

            {!mandatorySetupDone && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                        <h3 className="text-xs font-bold text-amber-900">Initial Setup Required</h3>
                        <p className="text-xs text-amber-700">
                            Configure GL and Payment Accounts first.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {setupSteps.map((step, idx) => (
                    <Card key={idx} className={`${step.disabled ? "opacity-50" : "hover:border-[#ea1315]/30 transition-colors"} shadow-sm py-4 gap-2`}>
                        <CardHeader className="p-4 py-0 pb-1">
                            <div className="flex justify-between items-center mb-2">
                                <div className={`p-1.5 rounded-md ${step.done ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-600"}`}>
                                    <step.icon className="w-5 h-5" />
                                </div>
                                {step.done ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Circle className="w-4 h-4 text-slate-200" />
                                )}
                            </div>
                            <CardTitle className="text-base font-bold">{step.title}</CardTitle>
                            <CardDescription className="text-xs line-clamp-1">{step.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <Button 
                                onClick={step.onClick} 
                                disabled={step.disabled}
                                className={`w-full h-8 text-xs font-bold ${step.done ? "bg-slate-50 text-slate-700 hover:bg-slate-100" : "bg-[#ea1315] text-white hover:bg-[#c71012]"}`}
                                variant={step.done ? "ghost" : "default"}
                            >
                                {step.done ? "Add Another" : "Configure"}
                                {!step.done && <ArrowRight className="ml-1 w-3 h-3" />}
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
            <CreateFeeTypeModal
                isOpen={createFeeTypeOpen}
                onClose={() => setCreateFeeTypeOpen(false)}
                refetchFeeTypes={refetchFeeTypes}
            />
            <CreateLoanProduct
                isOpen={createLoanProductOpen}
                onClose={() => setCreateLoanProductOpen(false)}
                refetchLoanTypes={refetchLoanProducts}
            />
            <CreateVentureType
                isOpen={createVentureTypeOpen}
                onClose={() => setCreateVentureTypeOpen(false)}
                refetchVentureTypes={refetchVentureTypes}
            />
            <CreateMember
                openModal={createMemberOpen}
                closeModal={() => setCreateMemberOpen(false)}
            />
        </div>
    );
}
