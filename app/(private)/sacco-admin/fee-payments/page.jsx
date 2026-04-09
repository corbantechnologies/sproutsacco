"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFetchFeeAccounts } from "@/hooks/feeaccounts/actions";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    CreditCard,
    Eye,
    Receipt,
    FileUp,
    Plus,
    Users,
    BadgePercent,
    ArrowLeft,
    ListFilter
} from "lucide-react";
import Link from "next/link";

import BulkFeePaymentCreate from "@/forms/feepayments/BulkFeePaymentCreate";
import BulkFeePaymentUploadCreate from "@/forms/feepayments/BulkFeePaymentUploadCreate";

export default function FeePaymentsManagementPage() {
    const router = useRouter();
    const { data: feeAccounts, isLoading, refetch } = useFetchFeeAccounts();

    const [searchTerm, setSearchTerm] = useState("");

    const filteredAccounts = useMemo(() => {
        if (!feeAccounts) return [];
        return feeAccounts.filter(acc => {
            const matchesSearch =
                acc.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (`${acc.member?.first_name} ${acc.member?.last_name}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.fee_type?.name?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch;
        });
    }, [feeAccounts, searchTerm]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded hover:bg-white border shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            <Receipt className="w-6 h-6 text-amber-600" /> Fee Collections
                        </h1>
                        <p className="text-slate-500 text-sm font-medium">
                            Track and collect administrative and service fees.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border shadow-sm bg-amber-600 text-white rounded-xl">
                    <CardHeader className="p-6">
                        <CardDescription className="text-white/60 font-bold uppercase tracking-widest text-[9px]">Total Receivables</CardDescription>
                        <CardTitle className="text-3xl font-bold tracking-tight">
                            {feeAccounts?.reduce((sum, acc) => sum + Number(acc.outstanding_balance || 0), 0).toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border shadow-sm bg-white rounded-xl">
                    <CardHeader className="p-6">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Accounts Outstanding</CardDescription>
                        <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
                            {feeAccounts?.filter(a => Number(a.outstanding_balance) > 0).length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border shadow-sm bg-white rounded-xl">
                    <CardHeader className="p-6">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Fully Paid</CardDescription>
                        <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600">
                            {feeAccounts?.filter(a => Number(a.outstanding_balance) === 0).length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border shadow-sm bg-white rounded-xl">
                    <CardHeader className="p-6">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Avg Fee Bal</CardDescription>
                        <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
                            {feeAccounts?.length ? Math.round(feeAccounts.reduce((sum, acc) => sum + Number(acc.outstanding_balance || 0), 0) / feeAccounts.length).toLocaleString() : 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-white border p-1 h-12 shadow-sm mb-6">
                    <TabsTrigger value="list" className="px-6 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 font-bold text-xs uppercase tracking-wider transition-all">
                        <ListFilter className="w-4 h-4 mr-2" /> List View
                    </TabsTrigger>
                    <TabsTrigger value="bulk-create" className="px-6 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 font-bold text-xs uppercase tracking-wider transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Manual Batch
                    </TabsTrigger>
                    <TabsTrigger value="bulk-upload" className="px-6 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 font-bold text-xs uppercase tracking-wider transition-all">
                        <FileUp className="w-4 h-4 mr-2" /> CSV Import
                    </TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                    {/* Filter Bar */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative group w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-amber-600 transition-colors" />
                            <Input
                                placeholder="Search by member, account # or fee type..."
                                className="pl-12 h-12 rounded-lg border-slate-100 focus:border-amber-600 bg-slate-50/50 shadow-none border-0 ring-offset-transparent focus-visible:ring-1 focus-visible:ring-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Fee Accounts Table */}
                    <Card className="border shadow-sm rounded-xl overflow-hidden bg-white">
                        <CardHeader className="bg-white border-b px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">Fee Receivable Portfolio</CardTitle>
                                    <CardDescription className="text-xs font-medium text-slate-500 mt-1">A detailed view of all member fee accounts.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 border-b">
                                            <TableHead className="pl-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Payer Details</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Requirement</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Outstanding Balance</TableHead>
                                            <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</TableHead>
                                            <TableHead className="pr-8 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Profile</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAccounts.length > 0 ? (
                                            filteredAccounts.map((acc) => (
                                                <TableRow key={acc.reference} className="hover:bg-amber-50/30 transition-all border-b last:border-0 group h-20">
                                                    <TableCell className="pl-8">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-amber-700 transition-colors">{acc.member?.first_name} {acc.member?.last_name}</span>
                                                            <span className="text-[11px] font-semibold text-slate-400 font-mono tracking-tight uppercase">{acc.account_number}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1 px-2 bg-slate-100 rounded shadow-none border-transparent border">
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{acc.fee_type?.name}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-slate-800 font-mono text-sm tracking-tight">
                                                        {Number(acc.outstanding_balance).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center justify-center gap-1.5 w-fit mx-auto ring-1 ${Number(acc.outstanding_balance) === 0
                                                            ? "bg-green-50 text-green-700 ring-green-200"
                                                            : "bg-rose-50 text-rose-700 ring-rose-200"
                                                            }`}>
                                                            {Number(acc.outstanding_balance) === 0 ? "FULLY PAID" : "OWING"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pr-8 text-right">
                                                        <Link href={`/sacco-admin/members/${acc.member?.id}`}>
                                                            <Button size="icon" variant="ghost" className="rounded-lg hover:bg-white border-transparent hover:border-slate-200 border shadow-none h-9 w-9 transition-all text-slate-400 hover:text-amber-700 font-bold">
                                                                <Users className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-24 text-slate-300 font-bold uppercase tracking-[0.2em] text-sm">
                                                    No fee accounts found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bulk Form Tab */}
                <TabsContent value="bulk-create" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none bg-transparent pt-4">
                        <CardContent className="p-0">
                            <BulkFeePaymentCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk-upload" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none bg-white rounded-xl p-8 mt-4">
                        <CardContent className="p-0">
                            <BulkFeePaymentUploadCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
