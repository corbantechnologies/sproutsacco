"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchFeeTypes } from "@/hooks/feetypes/actions";
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
    BadgePercent,
    Pencil,
    Plus,
    FileUp,
    ListFilter,
    CheckCircle2,
    XCircle
} from "lucide-react";

import CreateFeeTypeModal from "@/forms/feetypes/CreateFeeType";
import UpdateFeeTypeModal from "@/forms/feetypes/UpdateFeeType";
import BulkFeeTypeCreate from "@/forms/feetypes/BulkFeeTypeCreate";
import BulkFeeTypeUploadCreate from "@/forms/feetypes/BulkFeeTypeUploadCreate";

export default function FeeTypesSetupPage() {
    const router = useRouter();
    const { data: myself } = useFetchMember();
    const {
        data: feetypes,
        isLoading,
        refetch
    } = useFetchFeeTypes();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);

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
                        className="rounded-full hover:bg-white"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                           <div className="bg-[#ea1315]/10 p-2 rounded-xl">
                               <BadgePercent className="w-6 h-6 text-[#ea1315]" />
                           </div>
                           Fee Management Setup
                        </h1>
                        <p className="text-slate-500 text-sm italic font-medium">
                            Define registration, insurance, and other SACCO service fees.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#ea1315] hover:bg-[#c71012] text-white text-xs font-bold shadow-lg shadow-rose-100 rounded-xl"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> New Fee Type
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-white border p-1 h-14 shadow-sm mb-8 rounded-2xl max-w-2xl mx-auto flex">
                    <TabsTrigger value="list" className="flex-1 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-[#ea1315] font-black text-[10px] uppercase tracking-[0.1em]">
                        <ListFilter className="w-4 h-4 mr-2" /> Current Fees
                    </TabsTrigger>
                    <TabsTrigger value="bulk-create" className="flex-1 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-[#ea1315] font-black text-[10px] uppercase tracking-[0.1em]">
                        <Plus className="w-4 h-4 mr-2" /> Batch Entry
                    </TabsTrigger>
                    <TabsTrigger value="bulk-upload" className="flex-1 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-[#ea1315] font-black text-[10px] uppercase tracking-[0.1em]">
                        <FileUp className="w-4 h-4 mr-2" /> Import CSV
                    </TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="shadow-2xl shadow-slate-200 border-none overflow-hidden rounded-[2rem]">
                        <CardHeader className="bg-white border-b px-8 py-6">
                            <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Fee Inventory</CardTitle>
                            <CardDescription className="text-sm font-medium text-slate-400 font-mono tracking-tighter">TOTAL CONFIGURED: {feetypes?.length || 0}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8 px-4 py-5">Fee Description</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-5 font-mono text-center">Amount (KES)</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-5">Global?</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-5">Accounting (GL)</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 py-5 text-center">Status</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-8 px-4 py-5">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {feetypes?.length > 0 ? (
                                            feetypes.map((fee) => (
                                                <TableRow key={fee.reference} className="hover:bg-slate-50/80 transition-all group border-b border-slate-50">
                                                    <TableCell className="text-sm font-black pl-8 py-6 text-slate-900 tracking-tight">{fee.name}</TableCell>
                                                    <TableCell className="text-base font-black text-slate-800 font-mono text-center">
                                                        {Number(fee.amount).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {fee.is_everyone ? (
                                                            <div className="flex items-center gap-1.5 text-[#174271] font-bold text-[10px] uppercase">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> YES
                                                            </div>
                                                        ) : (
                                                            <div className="text-slate-300 font-medium text-[10px] uppercase">NO</div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-[11px] font-bold text-slate-500 italic max-w-[150px] truncate">{fee.gl_account}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-[0.1em] border-2 shadow-sm ${
                                                            fee.is_active ? "bg-green-50 text-green-700 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                                        }`}>
                                                            {fee.is_active ? "ACTIVE" : "INACTIVE"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-8 py-6">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-slate-300 hover:text-[#ea1315] hover:bg-rose-50 rounded-xl transition-colors border-2 border-transparent hover:border-rose-100 shadow-none disabled:opacity-50"
                                                            onClick={() => {
                                                                setSelectedFee(fee);
                                                                setIsUpdateModalOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center h-64 text-slate-400 text-sm font-medium italic">
                                                    No fee types defined yet.
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
                <TabsContent value="bulk-create" className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <BulkFeeTypeCreate onBatchSuccess={refetch} />
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk-upload" className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <Card className="shadow-2xl shadow-slate-200 border-none bg-white rounded-[2rem] p-12">
                        <CardContent className="p-0">
                            <BulkFeeTypeUploadCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <CreateFeeTypeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                refetchFeeTypes={refetch}
            />
            <UpdateFeeTypeModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                refetchFeeTypes={refetch}
                feeType={selectedFee}
            />
        </div>
    );
}
