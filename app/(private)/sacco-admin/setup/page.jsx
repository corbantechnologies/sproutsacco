"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFetchMember } from "@/hooks/members/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
import { useFetchGLAccounts } from "@/hooks/glaccounts/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import { useFetchFeeTypes } from "@/hooks/feetypes/actions";

import LoadingSpinner from "@/components/general/LoadingSpinner";
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
    AlertCircle,
    BadgePercent,
} from "lucide-react";

export default function SetupPage() {
    const router = useRouter();
    const { data: myself, isLoading: isLoadingMyself } = useFetchMember();
    const { data: glaccounts, isLoading: isLoadingGLAccounts } = useFetchGLAccounts();
    const { data: paymentaccounts, isLoading: isLoadingPaymentAccounts } = useFetchPaymentAccounts();
    const { data: feetypes, isLoading: isLoadingFeeTypes } = useFetchFeeTypes();
    const { data: savingTypes, isLoading: isLoadingSavingTypes } = useFetchSavingsTypes();
    const { data: loanProducts, isLoading: isLoadingLoanProducts } = useFetchLoanProducts();

    if (
        isLoadingMyself ||
        isLoadingGLAccounts ||
        isLoadingPaymentAccounts ||
        isLoadingFeeTypes ||
        isLoadingSavingTypes ||
        isLoadingLoanProducts
    ) {
        return <LoadingSpinner />;
    }

    const glSetupDone = glaccounts?.length > 0;
    const paymentSetupDone = paymentaccounts?.length > 0;
    const mandatorySetupDone = glSetupDone && paymentSetupDone;

    const setupSteps = [
        {
            title: "GL Accounts",
            description: "Define General Ledger chart of accounts.",
            icon: Building2,
            done: glSetupDone,
            href: "/sacco-admin/setup/gl-accounts",
            mandatory: true,
        },
        {
            title: "Payment Accounts",
            description: "Configure bank and cash accounts.",
            icon: Wallet,
            done: paymentSetupDone,
            href: "/sacco-admin/setup/payment-accounts",
            mandatory: true,
            disabled: !glSetupDone,
        },
        {
            title: "Fee Types",
            description: "Define various SACCO fee structures.",
            icon: BadgePercent,
            done: feetypes?.length > 0,
            href: "/sacco-admin/setup/feetypes",
            disabled: !mandatorySetupDone,
        },
        {
            title: "Savings Products",
            description: "Define types of savings accounts.",
            icon: PiggyBank,
            done: savingTypes?.length > 0,
            href: "/sacco-admin/setup/saving-types",
            disabled: !mandatorySetupDone,
        },
        {
            title: "Loan Products",
            description: "Set up loan facilities and terms.",
            icon: HandCoins,
            done: loanProducts?.length > 0,
            href: "/sacco-admin/setup/loan-products",
            disabled: !mandatorySetupDone,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
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
                            Configure GL and Payment Accounts first to unlock more features.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {setupSteps.map((step, idx) => (
                    <Card 
                        key={idx} 
                        className={`${step.disabled ? "opacity-50" : "hover:border-[#ea1315]/30 cursor-pointer transition-colors"} shadow-sm py-4 gap-2`}
                        onClick={() => !step.disabled && router.push(step.href)}
                    >
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
                                disabled={step.disabled}
                                className={`w-full h-8 text-xs font-bold ${step.done ? "bg-slate-50 text-slate-700 hover:bg-slate-100" : "bg-[#ea1315] text-white hover:bg-[#c71012]"}`}
                                variant={step.done ? "ghost" : "default"}
                            >
                                {step.done ? "Manage items" : "Configure"}
                                {!step.done && <ArrowRight className="ml-1 w-3 h-3" />}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions / Getting Started Info */}
            <div className="mt-12 bg-white rounded-xl border p-8 text-center max-w-2xl mx-auto space-y-4">
                <div className="bg-[#174271]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                   <Settings2 className="w-8 h-8 text-[#174271]" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Advanced Configuration</h2>
                <p className="text-slate-500 text-sm italic">
                    Configure your SACCO financial foundation above. Click on any card to manage specific accounts, create products, or perform bulk uploads.
                </p>
                <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-50 text-left">
                        <h4 className="font-bold text-sm mb-1 text-slate-800">Support</h4>
                        <p className="text-[11px] text-slate-500">Need help setting up your chart of accounts? Contact support.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 text-left">
                        <h4 className="font-bold text-sm mb-1 text-slate-800">Audit Logs</h4>
                        <p className="text-[11px] text-slate-500">All setup changes are logged in the system audit trail.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Settings2({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M20 7h-9" />
            <path d="M14 17H5" />
            <circle cx="17" cy="17" r="3" />
            <circle cx="7" cy="7" r="3" />
        </svg>
    );
}
