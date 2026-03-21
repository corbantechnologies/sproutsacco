"use client";

import React, { useState } from "react";
import { useFetchMember } from "@/hooks/members/actions";
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { 
    CheckCircle2, 
    Circle, 
    ArrowRight, 
    Building2, 
    Wallet, 
    PiggyBank, 
    HandCoins, 
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

            {/* Item Listing Section */}
            <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-slate-700" />
                    <h2 className="text-lg font-bold text-slate-900">Configured Parameters</h2>
                </div>

                <Tabs defaultValue="gl" className="w-full">
                    <TabsList className="flex flex-wrap h-auto bg-white border p-1 mb-4">
                        <TabsTrigger value="gl" className="text-xs">GL Accounts</TabsTrigger>
                        <TabsTrigger value="payment" className="text-xs">Payment Accounts</TabsTrigger>
                        <TabsTrigger value="fees" className="text-xs">Fee Types</TabsTrigger>
                        <TabsTrigger value="savings" className="text-xs">Savings Types</TabsTrigger>
                        <TabsTrigger value="loans" className="text-xs">Loan Products</TabsTrigger>
                        <TabsTrigger value="ventures" className="text-xs">Venture Types</TabsTrigger>
                    </TabsList>

                    {/* GL Accounts Tab */}
                    <TabsContent value="gl">
                        <Card className="shadow-sm">
                            <CardContent className="p-0">
                                {glaccounts?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50">
                                                <TableHead className="text-xs font-bold">Name</TableHead>
                                                <TableHead className="text-xs font-bold">Category</TableHead>
                                                <TableHead className="text-xs font-bold">Code</TableHead>
                                                <TableHead className="text-xs font-bold">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {glaccounts.map((acc) => (
                                                <TableRow key={acc.id || acc.reference}>
                                                    <TableCell className="text-xs font-medium">{acc.name}</TableCell>
                                                    <TableCell className="text-xs capitalize">{acc.category?.toLowerCase()}</TableCell>
                                                    <TableCell className="text-xs">{acc.code}</TableCell>
                                                    <TableCell className="text-xs">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${acc.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                            {acc.is_active ? "Active" : "Inactive"}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-8 text-center text-xs text-slate-500">No GL accounts configured yet.</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payment Accounts Tab */}
                    <TabsContent value="payment">
                        <Card className="shadow-sm">
                            <CardContent className="p-0">
                                {paymentaccounts?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50">
                                                <TableHead className="text-xs font-bold">Name</TableHead>
                                                <TableHead className="text-xs font-bold">GL Account</TableHead>
                                                <TableHead className="text-xs font-bold">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paymentaccounts.map((acc) => (
                                                <TableRow key={acc.id || acc.reference}>
                                                    <TableCell className="text-xs font-medium">{acc.name}</TableCell>
                                                    <TableCell className="text-xs">{acc.gl_account}</TableCell>
                                                    <TableCell className="text-xs">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${acc.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                            {acc.is_active ? "Active" : "Inactive"}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-8 text-center text-xs text-slate-500">No payment accounts configured yet.</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Fee Types Tab */}
                    <TabsContent value="fees">
                        <Card className="shadow-sm">
                            <CardContent className="p-0">
                                {feetypes?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50">
                                                <TableHead className="text-xs font-bold">Name</TableHead>
                                                <TableHead className="text-xs font-bold">Amount</TableHead>
                                                <TableHead className="text-xs font-bold">GL Account</TableHead>
                                                <TableHead className="text-xs font-bold">Is Everyone?</TableHead>
                                                <TableHead className="text-xs font-bold">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {feetypes.map((fee) => (
                                                <TableRow key={fee.id || fee.reference}>
                                                    <TableCell className="text-xs font-medium">{fee.name}</TableCell>
                                                    <TableCell className="text-xs font-bold text-slate-700 font-mono">KES {Number(fee.amount).toLocaleString()}</TableCell>
                                                    <TableCell className="text-xs">{fee.gl_account}</TableCell>
                                                    <TableCell className="text-xs">{fee.is_everyone ? "Yes" : "No"}</TableCell>
                                                    <TableCell className="text-xs">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${fee.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                            {fee.is_active ? "Active" : "Inactive"}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-8 text-center text-xs text-slate-500">No fee types configured yet.</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Saving Types Tab */}
                    <TabsContent value="savings">
                        <Card className="shadow-sm">
                            <CardContent className="p-0">
                                {savingTypes?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50">
                                                <TableHead className="text-xs font-bold">Name</TableHead>
                                                <TableHead className="text-xs font-bold">Interest Rate</TableHead>
                                                <TableHead className="text-xs font-bold">Guarantee?</TableHead>
                                                <TableHead className="text-xs font-bold">GL Account</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {savingTypes.map((type) => (
                                                <TableRow key={type.id || type.reference}>
                                                    <TableCell className="text-xs font-medium">{type.name}</TableCell>
                                                    <TableCell className="text-xs">{type.interest_rate}%</TableCell>
                                                    <TableCell className="text-xs">{type.can_guarantee ? "Yes" : "No"}</TableCell>
                                                    <TableCell className="text-xs truncate max-w-[200px]">{type.gl_account || "-"}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-8 text-center text-xs text-slate-500">No saving types configured yet.</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Loan Products Tab */}
                    <TabsContent value="loans">
                        <Card className="shadow-sm">
                            <CardContent className="p-0">
                                {loanProducts?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50">
                                                <TableHead className="text-xs font-bold">Name</TableHead>
                                                <TableHead className="text-xs font-bold">Interest Rate</TableHead>
                                                <TableHead className="text-xs font-bold">Principal (Asset)</TableHead>
                                                <TableHead className="text-xs font-bold">Interest (Asset)</TableHead>
                                                <TableHead className="text-xs font-bold">Interest (Revenue)</TableHead>
                                                <TableHead className="text-xs font-bold">Penalty (Revenue)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loanProducts.map((loan) => (
                                                <TableRow key={loan.id || loan.reference}>
                                                    <TableCell className="text-xs font-medium">{loan.name}</TableCell>
                                                    <TableCell className="text-xs">{loan.interest_rate}%</TableCell>
                                                    <TableCell className="text-xs">{loan.gl_principal_asset || "-"}</TableCell>
                                                    <TableCell className="text-xs">{loan.gl_interest_asset || "-"}</TableCell>
                                                    <TableCell className="text-xs">{loan.gl_interest_revenue || "-"}</TableCell>
                                                    <TableCell className="text-xs">{loan.gl_penalty_revenue || "-"}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-8 text-center text-xs text-slate-500">No loan products configured yet.</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Venture Types Tab */}
                    <TabsContent value="ventures">
                        <Card className="shadow-sm">
                            <CardContent className="p-0">
                                {ventureTypes?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50">
                                                <TableHead className="text-xs font-bold">Name</TableHead>
                                                <TableHead className="text-xs font-bold">Interest Rate</TableHead>
                                                <TableHead className="text-xs font-bold">GL Account</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ventureTypes.map((venture) => (
                                                <TableRow key={venture.id || venture.reference}>
                                                    <TableCell className="text-xs font-medium">{venture.name}</TableCell>
                                                    <TableCell className="text-xs">{venture.interest_rate}%</TableCell>
                                                    <TableCell className="text-xs truncate max-w-[200px]">{venture.gl_account || "-"}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-8 text-center text-xs text-slate-500">No venture types configured yet.</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
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
        </div>
    );
}
