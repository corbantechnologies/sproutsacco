"use client";

import React, { useState } from "react";
import { useFetchMember, useFetchMembers } from "@/hooks/members/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
import { useFetchVentureTypes } from "@/hooks/venturetypes/actions";
import { useFetchGLAccounts } from "@/hooks/glaccounts/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import { useFetchFeeTypes } from "@/hooks/feetypes/actions";

// Here the admin sets up the SACCO System e.g. setting up GLAccounts, Payment Accounts, Loan Products, Savings Products, etc.
// Rules
// GLAccounts and Payment Accounts are the first to be setup
// All other setup depends on GLAccounts and Payment Accounts
// If at least one GLAccount and one Payment Account is setup, the admin can proceed to setup other things
// If no GLAccount and no Payment Account is setup, the admin cannot proceed to setup other things: they should be prompted to setup GLAccounts and Payment Accounts first

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


    return (
        <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        SACCO Setup
                    </h1>
                    <p className="text-slate-500 mt-1 text-lg">
                        Configure key system parameters
                    </p>
                </div>
                <div className="bg-white px-4 py-2 rounded-full border shadow-sm">
                    <p className="text-sm font-medium text-gray-900">
                        {myself?.salutation} {myself?.last_name} (Admin)
                    </p>
                </div>
            </div>
        </div>
    )
}