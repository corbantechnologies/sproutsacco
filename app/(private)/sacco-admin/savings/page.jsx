"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFetchMemberSavingsAccounts } from "@/hooks/savings/actions";
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
    PiggyBank,
    Eye,
    ArrowDownLeft,
    FileUp,
    Plus,
    History,
    TrendingUp,
    Wallet
} from "lucide-react";
import Link from "next/link";

import BulkSavingDepositCreate from "@/forms/savingsdeposits/BulkSavingDepositCreate";
import BulkSavingDepositUploadCreate from "@/forms/savingsdeposits/BulkSavingDepositUploadCreate";

export default function SavingsManagementPage() {
    const router = useRouter();
    // Assuming useFetchMemberSavingsAccounts("all") returns all accounts when passed "all"
    // or I might need to adjust based on the actual hook implementation
    const { data: accounts, isLoading, refetch } = useFetchMemberSavingsAccounts("all");

    const [searchTerm, setSearchTerm] = useState("");
    const [isBulkDepositOpen, setIsBulkDepositOpen] = useState(false);

    const filteredAccounts = useMemo(() => {
        if (!accounts) return [];
        return accounts.filter(acc => {
            const matchesSearch =
                acc.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (`${acc.member?.first_name} ${acc.member?.last_name}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch;
        });
    }, [accounts, searchTerm]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tighter flex items-center gap-3">
                        <div className="bg-emerald-600 p-2 rounded text-white shadow-lg shadow-emerald-100">
                            <PiggyBank className="w-8 h-8" />
                        </div>
                        Savings Core
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest opacity-80">Portfolio management for all member deposit accounts.</p>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={() => setIsBulkDepositOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 h-12 rounded shadow-xl shadow-emerald-100 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <ArrowDownLeft className="w-5 h-5" /> Bulk Deposit
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm bg-emerald-600 text-white rounded-[2rem] p-6">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-white/60 font-bold uppercase tracking-widest text-[9px]">Total Accounts</CardDescription>
                        <CardTitle className="text-3xl font-semibold tracking-tighter">{accounts?.length || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-6 border-b-4 border-b-blue-500">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Total Deposits (KES)</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-slate-800 font-mono">
                            {accounts?.reduce((sum, acc) => sum + Number(acc.balance || 0), 0).toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-6">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Avg Balance</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-slate-800 font-mono">
                            {accounts?.length ? Math.round(accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0) / accounts.length).toLocaleString() : 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-6">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">High Yielders</CardDescription>
                        <CardTitle className="text-3xl font-semibold text-emerald-600">
                            {accounts?.filter(a => Number(a.balance) > 100000).length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                    <Input
                        placeholder="Filter by member name, account number or product..."
                        className="pl-14 h-14 rounded border-slate-100 focus:border-emerald-600 bg-slate-50/50 shadow-none border-0 text-base font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Savings Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-b border-slate-100">
                                <TableHead className="pl-12 py-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Contributor</TableHead>
                                <TableHead className="py-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Product Line</TableHead>
                                <TableHead className="py-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 text-center">Net Balance</TableHead>
                                <TableHead className="py-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 text-center">Status</TableHead>
                                <TableHead className="pr-12 py-7 text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAccounts.length > 0 ? (
                                filteredAccounts.map((acc) => (
                                    <TableRow key={acc.reference} className="hover:bg-emerald-50/30 transition-all border-b border-slate-50 last:border-0 group h-24">
                                        <TableCell className="pl-12">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-800 text-base tracking-tight group-hover:text-emerald-700 transition-colors">{acc.member?.first_name} {acc.member?.last_name}</span>
                                                <span className="text-[11px] font-bold text-slate-400 font-mono italic tracking-tighter uppercase">{acc.account_number}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight">{acc.product?.name}</span>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase leading-none mt-1">Product Type</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-lg font-semibold text-slate-800 font-mono tracking-tighter">
                                                {Number(acc.balance).toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="px-3 py-1.5 rounded text-[9px] font-semibold tracking-widest border-2 bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm">
                                                ACTIVE
                                            </span>
                                        </TableCell>
                                        <TableCell className="pr-12 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/sacco-admin/members/${acc.member?.id}`}>
                                                    <Button size="icon" variant="ghost" className="rounded hover:bg-white border text-slate-300 hover:text-emerald-700 hover:border-emerald-100 h-10 w-10">
                                                        <Eye className="w-5 h-5" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-24 text-slate-300 font-semibold uppercase tracking-[0.6em] italic opacity-50">
                                        Zero deposit records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Bulk Deposit Modal */}
            <Dialog open={isBulkDepositOpen} onOpenChange={setIsBulkDepositOpen}>
                <DialogContent className="max-w-[1200px] bg-slate-50 border-none rounded-[4rem] p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="bg-white px-12 py-10 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle className="text-3xl font-semibold text-emerald-800 tracking-tighter flex items-center gap-3">
                                <ArrowDownLeft className="w-8 h-8 p-1.5 bg-emerald-100 rounded" /> Bulk Funds Collection
                            </DialogTitle>
                            <p className="text-slate-400 font-medium text-sm mt-1">Batch process multiple member savings deposits simultaneously.</p>
                        </div>
                    </DialogHeader>

                    <div className="p-12">
                        <Tabs defaultValue="form" className="w-full">
                            <TabsList className="bg-white border p-2 rounded h-16 mb-10 max-w-sm shadow-inner flex items-stretch">
                                <TabsTrigger value="form" className="flex-1 rounded data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold text-xs uppercase tracking-widest transition-all">
                                    <Plus className="w-4 h-4 mr-2" /> Manual Data
                                </TabsTrigger>
                                <TabsTrigger value="upload" className="flex-1 rounded data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold text-xs uppercase tracking-widest transition-all">
                                    <FileUp className="w-4 h-4 mr-2" /> CSV Ingest
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="form" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <BulkSavingDepositCreate onBatchSuccess={() => {
                                    refetch();
                                }} />
                            </TabsContent>

                            <TabsContent value="upload" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <BulkSavingDepositUploadCreate onBatchSuccess={() => {
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
