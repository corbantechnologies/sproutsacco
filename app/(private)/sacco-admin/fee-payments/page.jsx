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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    CreditCard,
    Eye,
    Receipt,
    FileUp,
    Plus,
    Filter,
    Users,
    BadgePercent
} from "lucide-react";
import Link from "next/link";

import BulkFeePaymentCreate from "@/forms/feepayments/BulkFeePaymentCreate";
import BulkFeePaymentUploadCreate from "@/forms/feepayments/BulkFeePaymentUploadCreate";

export default function FeePaymentsManagementPage() {
    const router = useRouter();
    const { data: feeAccounts, isLoading, refetch } = useFetchFeeAccounts();

    const [searchTerm, setSearchTerm] = useState("");
    const [isBulkPaymentOpen, setIsBulkPaymentOpen] = useState(false);

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
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tighter flex items-center gap-3">
                        <div className="bg-amber-500 p-2 rounded text-white shadow-lg shadow-amber-100">
                            <Receipt className="w-8 h-8" />
                        </div>
                        Fee Collections
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest opacity-80">Track and collect administrative and service fees.</p>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={() => setIsBulkPaymentOpen(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 h-12 rounded shadow-xl shadow-amber-100 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Collect Batch Fees
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm bg-amber-600 text-white rounded-[2rem] p-6">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-white/60 font-bold uppercase tracking-widest text-[9px]">Total Receivables</CardDescription>
                        <CardTitle className="text-3xl font-semibold tracking-tighter">
                            {feeAccounts?.reduce((sum, acc) => sum + Number(acc.outstanding_balance || 0), 0).toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-6 border-b-4 border-b-amber-500">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Accounts Outstanding</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-slate-800">
                            {feeAccounts?.filter(a => Number(a.outstanding_balance) > 0).length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-6">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Fully Paid</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-emerald-600">
                            {feeAccounts?.filter(a => Number(a.outstanding_balance) === 0).length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-6">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Avg Fee Bal</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-slate-800">
                            {feeAccounts?.length ? Math.round(feeAccounts.reduce((sum, acc) => sum + Number(acc.outstanding_balance || 0), 0) / feeAccounts.length).toLocaleString() : 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-amber-600 transition-colors" />
                    <Input
                        placeholder="Search by member, account # or fee type..."
                        className="pl-14 h-14 rounded border-slate-100 focus:border-amber-600 bg-slate-50/50 shadow-none border-0 text-base font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Fee Accounts Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-b border-slate-100">
                                <TableHead className="pl-12 py-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Payer Details</TableHead>
                                <TableHead className="py-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Requirement</TableHead>
                                <TableHead className="py-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 text-center">Outstanding Balance</TableHead>
                                <TableHead className="py-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 text-center">Status</TableHead>
                                <TableHead className="pr-12 py-7 text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Profile</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAccounts.length > 0 ? (
                                filteredAccounts.map((acc) => (
                                    <TableRow key={acc.reference} className="hover:bg-amber-50/30 transition-all border-b border-slate-50 last:border-0 group h-24">
                                        <TableCell className="pl-12">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-800 text-base tracking-tight group-hover:text-amber-700 transition-colors">{acc.member?.first_name} {acc.member?.last_name}</span>
                                                <span className="text-[11px] font-bold text-slate-400 font-mono italic tracking-tighter uppercase">{acc.account_number}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-white border border-slate-100 rounded shadow-sm">
                                                    <BadgePercent className="w-3.5 h-3.5 text-amber-500" />
                                                </div>
                                                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight">{acc.fee_type?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-semibold text-slate-800 font-mono text-lg tracking-tighter">
                                            {Number(acc.outstanding_balance).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`px-3 py-1.5 rounded text-[9px] font-semibold tracking-widest border-2 shadow-sm ${Number(acc.outstanding_balance) === 0
                                                ? "bg-green-50 text-green-700 border-green-100"
                                                : "bg-rose-50 text-rose-700 border-rose-100"
                                                }`}>
                                                {Number(acc.outstanding_balance) === 0 ? "FULLY PAID" : "OWING"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="pr-12 text-right">
                                            <Link href={`/sacco-admin/members/${acc.member?.id}`}>
                                                <Button size="icon" variant="ghost" className="rounded hover:bg-white border text-slate-300 hover:text-amber-700 hover:border-amber-100 h-10 w-10 transition-all">
                                                    <Users className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-24 text-slate-300 font-semibold uppercase tracking-[0.6em] italic opacity-50">
                                        No fee receivable accounts found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Bulk Payment Modal */}
            <Dialog open={isBulkPaymentOpen} onOpenChange={setIsBulkPaymentOpen}>
                <DialogContent className="max-w-[1200px] bg-slate-50 border-none rounded-[4rem] p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="bg-white px-12 py-10 border-b border-slate-100">
                        <DialogTitle className="text-3xl font-semibold text-amber-800 tracking-tighter flex items-center gap-3">
                            <CreditCard className="w-8 h-8 p-1.5 bg-amber-100 rounded" /> Multi-Fee Collection Engine
                        </DialogTitle>
                        <p className="text-slate-400 font-medium text-sm mt-1">Aggregated receivable processing for registration, insurance, and service fees.</p>
                    </DialogHeader>

                    <div className="p-12">
                        <Tabs defaultValue="form" className="w-full">
                            <TabsList className="bg-white border p-2 rounded h-16 mb-10 max-w-sm shadow-inner flex items-stretch">
                                <TabsTrigger value="form" className="flex-1 rounded data-[state=active]:bg-amber-600 data-[state=active]:text-white font-semibold text-xs uppercase tracking-widest transition-all">
                                    <Plus className="w-4 h-4 mr-2" /> Manual Batch
                                </TabsTrigger>
                                <TabsTrigger value="upload" className="flex-1 rounded data-[state=active]:bg-amber-600 data-[state=active]:text-white font-semibold text-xs uppercase tracking-widest transition-all">
                                    <FileUp className="w-4 h-4 mr-2" /> CSV Import
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="form" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <BulkFeePaymentCreate onBatchSuccess={() => {
                                    refetch();
                                }} />
                            </TabsContent>

                            <TabsContent value="upload" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                                <BulkFeePaymentUploadCreate onBatchSuccess={() => {
                                    refetch();
                                }} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
