"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFetchLoans } from "@/hooks/loans/actions";
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
    Filter,
    HandCoins,
    Eye,
    ChevronRight,
    ArrowUpRight,
    FileUp,
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import Link from "next/link";

import BulkLoanDisbursementCreate from "@/forms/loandisbursements/BulkLoanDisbursementCreate";
import BulkLoanDisbursementUploadCreate from "@/forms/loandisbursements/BulkLoanDisbursementUploadCreate";

export default function LoansManagementPage() {
    const router = useRouter();
    const { data: loans, isLoading, refetch } = useFetchLoans();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isBulkDisburseOpen, setIsBulkDisburseOpen] = useState(false);

    const filteredLoans = useMemo(() => {
        if (!loans) return [];
        return loans.filter(loan => {
            const matchesSearch =
                loan.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (`${loan.member?.first_name} ${loan.member?.last_name}`).toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || loan.application?.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [loans, searchTerm, statusFilter]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tighter flex items-center gap-3">
                        <div className="bg-[#174271] p-2 rounded text-white shadow-lg">
                            <HandCoins className="w-8 h-8" />
                        </div>
                        Loans Portfolio
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage all SACCO loan accounts and disbursements.</p>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={() => setIsBulkDisburseOpen(true)}
                        className="bg-[#ea1315] hover:bg-[#c71012] text-white font-semibold px-6 h-12 rounded shadow-xl shadow-rose-100 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <ArrowUpRight className="w-5 h-5" /> Bulk Disbursement
                    </Button>
                </div>
            </div>

            {/* Stats Overview (Optional Placeholder) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-[#174271] text-white rounded-[2rem] p-6">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Active Accounts</CardDescription>
                        <CardTitle className="text-3xl font-semibold">{loans?.length || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-6">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pending Approval</CardDescription>
                        <CardTitle className="text-3xl font-semibold text-slate-800">
                            {loans?.filter(l => l.application?.status === 'Pending')?.length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-6">
                    <CardHeader className="p-0 pb-2">
                        <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Approved (Awaiting Funding)</CardDescription>
                        <CardTitle className="text-3xl font-semibold text-emerald-600">
                            {loans?.filter(l => l.application?.status === 'Approved')?.length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#174271] transition-colors" />
                    <Input
                        placeholder="Search by member name or account number..."
                        className="pl-12 h-12 rounded border-slate-100 focus:border-[#174271] bg-slate-50 shadow-none border-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="inline-flex bg-slate-100 rounded p-1 gap-1">
                        {['all', 'Approved', 'Disbursed', 'Pending'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 h-10 rounded text-[10px] font-semibold uppercase tracking-widest transition-all ${statusFilter === status
                                    ? "bg-white text-[#174271] shadow-md"
                                    : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loans Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-b border-slate-100">
                                <TableHead className="pl-10 py-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Account Owner</TableHead>
                                <TableHead className="py-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Loan Product</TableHead>
                                <TableHead className="py-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 text-center">Principal</TableHead>
                                <TableHead className="py-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 text-center">Balance</TableHead>
                                <TableHead className="py-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 text-center">Status</TableHead>
                                <TableHead className="pr-10 py-6 text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Quick View</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLoans.length > 0 ? (
                                filteredLoans.map((loan) => (
                                    <TableRow key={loan.reference} className="hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 group h-24">
                                        <TableCell className="pl-10">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-800 text-base tracking-tight">{loan.member?.first_name} {loan.member?.last_name}</span>
                                                <span className="text-[11px] font-bold text-slate-400 font-mono italic">{loan.account_number}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="inline-flex items-center gap-2 bg-[#174271]/5 px-3 py-1 rounded border border-[#174271]/10">
                                                <span className="text-[11px] font-semibold text-[#174271] uppercase">{loan.product?.name || "Product"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-semibold text-slate-800 font-mono">
                                            {Number(loan.principal).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center font-semibold text-[#ea1315] font-mono">
                                            {Number(loan.balance).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`px-3 py-1.5 rounded text-[10px] font-semibold tracking-widest border-2 flex items-center justify-center gap-1.5 w-fit mx-auto ${loan.application?.status === 'Disbursed'
                                                ? "bg-green-50 text-green-700 border-green-100"
                                                : loan.application?.status === 'Approved'
                                                    ? "bg-blue-50 text-blue-700 border-blue-100 animate-pulse"
                                                    : "bg-slate-50 text-slate-400 border-slate-100"
                                                }`}>
                                                {loan.application?.status === 'Disbursed' ? <CheckCircle2 className="w-3 h-3" /> : loan.application?.status === 'Approved' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                {loan.application?.status?.toUpperCase() || "PENDING"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="pr-10 text-right">
                                            <Link href={`/sacco-admin/members/${loan.member?.id}/${loan.reference}`}>
                                                <Button size="icon" variant="ghost" className="rounded hover:bg-white border-2 border-transparent hover:border-slate-100 shadow-none h-11 w-11 transition-all group-hover:text-[#174271]">
                                                    <Eye className="w-5 h-5 text-slate-300 group-hover:text-[#174271]" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-20 text-slate-300 font-semibold uppercase tracking-[0.5em] italic">
                                        No loan accounts matching your criteria
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Bulk Disbursement Modal */}
            <Dialog open={isBulkDisburseOpen} onOpenChange={setIsBulkDisburseOpen}>
                <DialogContent className="max-w-[1200px] bg-slate-50 border-none rounded-[3rem] p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="bg-white px-10 py-8 border-b border-slate-100">
                        <DialogTitle className="text-2xl font-semibold text-[#174271] tracking-tighter flex items-center gap-2">
                            <ArrowUpRight className="w-6 h-6" /> Bulk Loan Funding
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-8">
                        <Tabs defaultValue="form" className="w-full">
                            <TabsList className="bg-white border p-1 rounded h-14 mb-8 max-w-md shadow-sm">
                                <TabsTrigger value="form" className="flex-1 rounded data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-semibold text-[10px] uppercase tracking-widest">
                                    <Plus className="w-4 h-4 mr-2" /> Manual Batch
                                </TabsTrigger>
                                <TabsTrigger value="upload" className="flex-1 rounded data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-semibold text-[10px] uppercase tracking-widest">
                                    <FileUp className="w-4 h-4 mr-2" /> CSV Upload
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="form">
                                <BulkLoanDisbursementCreate onBatchSuccess={() => {
                                    refetch();
                                    // Optionally stay open or close? I'll let the nested component handle stay/go
                                }} />
                            </TabsContent>

                            <TabsContent value="upload">
                                <BulkLoanDisbursementUploadCreate onBatchSuccess={() => {
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
