"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
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
    PiggyBank,
    Pencil,
    Plus,
    FileUp,
    ListFilter,
    ShieldCheck,
    Coins
} from "lucide-react";

import CreateSavingTypeModal from "@/forms/savingtypes/CreateSavingType";
import UpdateSavingTypeModal from "@/forms/savingtypes/UpdateSavingType";
import BulkSavingTypeCreate from "@/forms/savingtypes/BulkSavingTypeCreate";
import BulkSavingTypeUploadCreate from "@/forms/savingtypes/BulkSavingTypeUploadCreate";

export default function SavingTypesSetupPage() {
    const router = useRouter();
    const { data: myself } = useFetchMember();
    const {
        data: savingTypes,
        isLoading,
        refetch
    } = useFetchSavingsTypes();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

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
                        className="rounded-full hover:bg-white text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                           <div className="bg-emerald-500/10 p-2 rounded-xl">
                               <PiggyBank className="w-6 h-6 text-emerald-600" />
                           </div>
                           Savings Product Setup
                        </h1>
                        <p className="text-slate-500 text-sm font-medium italic">
                            Configure deposit types, interest yields, and guarantee permissions.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-50 rounded-xl px-5 h-10 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> Define New Product
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-white border p-1.5 h-14 shadow-sm mb-8 rounded-[1.25rem] max-w-2xl mx-auto flex">
                    <TabsTrigger value="list" className="flex-1 rounded-xl data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 font-black text-[10px] uppercase tracking-widest transition-all">
                        <ListFilter className="w-4 h-4 mr-2" /> All Products
                    </TabsTrigger>
                    <TabsTrigger value="bulk-create" className="flex-1 rounded-xl data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 font-black text-[10px] uppercase tracking-widest transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Batch Entry
                    </TabsTrigger>
                    <TabsTrigger value="bulk-upload" className="flex-1 rounded-xl data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 font-black text-[10px] uppercase tracking-widest transition-all">
                        <FileUp className="w-4 h-4 mr-2" /> Import CSV
                    </TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <Card className="shadow-2xl shadow-slate-200/50 border-none overflow-hidden rounded-[2.5rem]">
                        <CardHeader className="bg-white border-b px-10 py-8">
                            <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Product Matrix</CardTitle>
                            <CardDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Saving Schemes: {savingTypes?.length || 0}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 border-b border-slate-100">
                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-10 px-4 py-5">Product Name</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-5 text-center">Interest APY</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-5 font-mono">Guarantee Role</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-5">Accounting Control</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right pr-10 px-4 py-5">Modified</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {savingTypes?.length > 0 ? (
                                            savingTypes.map((type) => (
                                                <TableRow key={type.reference} className="hover:bg-emerald-50/30 transition-all group border-b border-slate-50 last:border-0 grow-row">
                                                    <TableCell className="text-[15px] font-black pl-10 py-7 text-slate-800 tracking-tight">{type.name}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="text-lg font-black text-emerald-600 font-mono italic">{type.interest_rate}%</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {type.can_guarantee ? (
                                                            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                                <span className="font-black text-[10px] uppercase tracking-tighter">Guarantees Loans</span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-slate-300 font-medium text-[10px] uppercase tracking-tighter px-3">Standard Only</div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-[12px] font-bold text-slate-500 italic max-w-[200px] truncate flex items-center gap-2">
                                                        <Coins className="w-3.5 h-3.5 text-slate-300" /> {type.gl_account || "NO LEDGER LINKED"}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-10 py-7">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 text-slate-300 hover:text-emerald-600 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-emerald-100 shadow-none"
                                                            onClick={() => {
                                                                setSelectedType(type);
                                                                setIsUpdateModalOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="h-4.5 w-4.5" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center h-80 text-slate-300 text-sm font-bold uppercase tracking-widest italic py-12">
                                                    Product List Empty
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
                <TabsContent value="bulk-create" className="animate-in fade-in zoom-in-95 duration-300">
                    <BulkSavingTypeCreate onBatchSuccess={refetch} />
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk-upload" className="animate-in fade-in zoom-in-95 duration-300">
                    <Card className="shadow-2xl shadow-slate-200 border-none bg-white rounded-[3rem] p-16">
                        <CardContent className="p-0">
                            <BulkSavingTypeUploadCreate onBatchSuccess={refetch} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <CreateSavingTypeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                refetchSavingTypes={refetch}
            />
            <UpdateSavingTypeModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                refetchSavingTypes={refetch}
                savingType={selectedType}
            />
        </div>
    );
}
