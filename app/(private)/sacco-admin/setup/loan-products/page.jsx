"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
import { useFetchMember } from "@/hooks/members/actions";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    ArrowLeft,
    HandCoins,
    Pencil,
    Plus,
    FileUp,
    ListFilter,
    Settings,
    TrendingUp,
    Percent
} from "lucide-react";

import CreateLoanProductModal from "@/forms/loanproducts/CreateLoanProduct";
import UpdateLoanProductModal from "@/forms/loanproducts/UpdateLoanProduct";
import BulkLoanProductCreate from "@/forms/loanproducts/BulkLoanProductCreate";
import BulkLoanProductUploadCreate from "@/forms/loanproducts/BulkLoanProductUploadCreate";

export default function LoanProductsSetupPage() {
    const router = useRouter();
    const { data: myself } = useFetchMember();
    const {
        data: loanProducts,
        isLoading,
        refetch
    } = useFetchLoanProducts();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.push("/sacco-admin/setup")}
                        className="rounded-full hover:bg-white text-slate-400 hover:text-[#174271] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                           <div className="bg-[#174271]/10 p-2 rounded-xl border border-[#174271]/20">
                               <HandCoins className="w-6 h-6 text-[#174271]" />
                           </div>
                           Loan Product Configuration
                        </h1>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest opacity-60">
                            Establish loan types, interest computation methods, and risk fees.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#174271] hover:bg-slate-800 text-white text-xs font-black shadow-xl shadow-slate-200 rounded-xl px-6 h-11 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> New Loan Scheme
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-white border-2 border-slate-100 p-2 h-16 shadow-lg mb-10 rounded-[2rem] max-w-2xl mx-auto flex items-stretch">
                    <TabsTrigger value="list" className="flex-1 rounded-[1.5rem] data-[state=active]:bg-[#174271] data-[state=active]:text-white font-black text-xs uppercase tracking-[0.2em] transition-all">
                        <ListFilter className="w-4 h-4 mr-2" /> Schemes
                    </TabsTrigger>
                    <TabsTrigger value="bulk-create" className="flex-1 rounded-[1.5rem] data-[state=active]:bg-[#174271] data-[state=active]:text-white font-black text-xs uppercase tracking-[0.2em] transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Batch Define
                    </TabsTrigger>
                    <TabsTrigger value="bulk-upload" className="flex-1 rounded-[1.5rem] data-[state=active]:bg-[#174271] data-[state=active]:text-white font-black text-xs uppercase tracking-[0.2em] transition-all">
                        <FileUp className="w-4 h-4 mr-2" /> Bulk Sync
                    </TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="shadow-2xl shadow-slate-300/40 border-none overflow-hidden rounded-[3rem]">
                        <CardHeader className="bg-white border-b border-slate-50 px-10 py-8">
                            <CardTitle className="text-2xl font-black text-[#174271] tracking-tighter">Available Loan Facilities</CardTitle>
                            <CardDescription className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em]">System Registered Schemes: {loanProducts?.length || 0}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 border-b border-slate-100">
                                            <TableHead className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 pl-10 px-4 py-6">Product Description</TableHead>
                                            <TableHead className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 py-6">Method</TableHead>
                                            <TableHead className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 py-6 text-center">Interest / Fee</TableHead>
                                            <TableHead className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 py-6">Ledger Tracking (Principal)</TableHead>
                                            <TableHead className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-right pr-10 px-4 py-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loanProducts?.length > 0 ? (
                                            loanProducts.map((p) => (
                                                <TableRow key={p.reference} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0 hover:scale-[0.998]">
                                                    <TableCell className="text-lg font-black pl-10 py-8 text-slate-900 tracking-tighter group-hover:text-[#174271] transition-colors">{p.name}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black uppercase text-slate-800">{p.interest_method}</span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic leading-none mt-1">Computation</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-lg font-black text-emerald-600 font-mono tracking-tighter">{p.interest_rate}%</span>
                                                                <span className="text-[9px] font-black text-slate-300 uppercase leading-none">Yield</span>
                                                            </div>
                                                            <div className="w-px h-8 bg-slate-100 mx-1" />
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-lg font-black text-amber-500 font-mono tracking-tighter">{p.processing_fee}%</span>
                                                                <span className="text-[9px] font-black text-slate-300 uppercase leading-none">Origination</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="max-w-[180px]">
                                                        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                                                            <div className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-50 group-hover:bg-slate-50 transition-colors">
                                                                <Settings className="w-3.5 h-3.5 text-slate-400" />
                                                            </div>
                                                            <span className="text-[11px] font-bold text-slate-600 truncate">{p.gl_principal_asset || "No Ledger Configured"}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-10 py-8">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-11 w-11 text-slate-200 hover:text-[#174271] hover:bg-white rounded-2xl transition-all border-2 border-transparent hover:border-slate-100 shadow-none scale-100 active:scale-90"
                                                            onClick={() => {
                                                                setSelectedProduct(p);
                                                                setIsUpdateModalOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="h-5 w-5" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center h-96 text-slate-300 text-sm font-black uppercase tracking-[0.4em] py-12 italic">
                                                   Scheme Matrix Is Blank
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
                <TabsContent value="bulk-create" className="animate-in fade-in zoom-in-95 duration-400">
                    <BulkLoanProductCreate onBatchSuccess={refetch} />
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk-upload" className="animate-in fade-in zoom-in-95 duration-400">
                    <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none bg-white rounded-[3.5rem] p-20">
                        <CardContent className="p-0">
                            <BulkLoanProductUploadCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <CreateLoanProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                refetchLoanTypes={refetch}
            />
            <UpdateLoanProductModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                refetchLoanTypes={refetch}
                loanProduct={selectedProduct}
            />
        </div>
    );
}
