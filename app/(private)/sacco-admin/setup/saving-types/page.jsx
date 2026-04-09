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
                        className="rounded-full hover:bg-white text-slate-400 hover:text-[#174271] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                           <PiggyBank className="w-6 h-6 text-[#174271]" /> Savings Product Setup
                        </h1>
                        <p className="text-slate-500 text-sm italic">
                            Configure deposit types, interest yields, and guarantee permissions.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#174271] hover:bg-[#12345a] text-white text-xs font-bold shadow-sm rounded-lg"
                    >
                        <Plus className="w-4 h-4 mr-1.5" /> Define New Product
                    </Button>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-white border p-1 h-12 shadow-sm mb-6 rounded-lg">
                    <TabsTrigger value="list" className="px-8 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] font-bold text-xs uppercase tracking-widest transition-all">
                        <ListFilter className="w-4 h-4 mr-2" /> All Products
                    </TabsTrigger>
                    <TabsTrigger value="bulk-create" className="px-8 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] font-bold text-xs uppercase tracking-widest transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Batch Entry
                    </TabsTrigger>
                    <TabsTrigger value="bulk-upload" className="px-8 data-[state=active]:bg-slate-50 data-[state=active]:text-[#174271] font-bold text-xs uppercase tracking-widest transition-all">
                        <FileUp className="w-4 h-4 mr-2" /> Import CSV
                    </TabsTrigger>
                </TabsList>

                {/* List Tab */}
                <TabsContent value="list" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="shadow-sm border-none overflow-hidden rounded-xl">
                        <CardHeader className="bg-white border-b px-6 py-4">
                            <CardTitle className="text-lg font-bold text-slate-800">Product Matrix</CardTitle>
                            <CardDescription className="text-xs">Active Saving Schemes: {savingTypes?.length || 0}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500 pl-6 px-4 py-4">Product Name</TableHead>
                                            <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500 px-4 py-4 text-center">Interest APY</TableHead>
                                            <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500 px-4 py-4">Guarantee Role</TableHead>
                                            <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500 px-4 py-4">Accounting Control</TableHead>
                                            <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500 text-right pr-6 px-4 py-4">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {savingTypes?.length > 0 ? (
                                            savingTypes.map((type) => (
                                                <TableRow key={type.reference} className="hover:bg-slate-50 transition-colors group border-b border-slate-50">
                                                    <TableCell className="text-sm font-bold pl-6 py-5 text-slate-800">{type.name}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="text-base font-bold text-[#174271] font-mono">{type.interest_rate}%</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {type.can_guarantee ? (
                                                            <div className="flex items-center gap-2 text-green-700 bg-green-50 w-fit px-2 py-0.5 rounded-full border border-green-100 shadow-sm text-[10px] font-bold uppercase">
                                                                <ShieldCheck className="w-3.5 h-3.5" /> Guarantees Loans
                                                            </div>
                                                        ) : (
                                                            <div className="text-slate-300 font-medium text-[10px] uppercase">Standard Only</div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-[11px] font-medium text-slate-500 italic flex items-center gap-2 py-5">
                                                        <Coins className="w-3.5 h-3.5 text-slate-300" /> {type.gl_account || "NO LEDGER LINKED"}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-5">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-400 hover:text-[#174271] hover:bg-white border-transparent hover:border-slate-200 border rounded-lg transition-all"
                                                            onClick={() => {
                                                                setSelectedType(type);
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
                                                <TableCell colSpan={5} className="text-center h-48 text-slate-400 text-sm italic py-12">
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
                <TabsContent value="bulk-create" className="animate-in fade-in zoom-in-95 duration-200">
                    <BulkSavingTypeCreate onBatchSuccess={refetch} />
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk-upload" className="animate-in fade-in zoom-in-95 duration-200">
                    <Card className="shadow-sm border-none bg-white rounded-xl p-8">
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
