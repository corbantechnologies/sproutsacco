"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { bulkUploadFeePayments, downloadFeePaymentsTemplate } from "@/services/feepayments";
import { FileUp, X, Download, FileCheck, Users } from "lucide-react";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

function BulkFeePaymentUpload({ onBatchSuccess }) {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const token = useAxiosAuth();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
                setFile(selectedFile);
            } else {
                toast.error("Please select a valid CSV file.");
                e.target.value = null;
            }
        }
    };

    const clearFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            await downloadFeePaymentsTemplate(token);
            toast.success("Template downloaded successfully!");
        } catch (error) {
            toast.error("Failed to download template.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file first.");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);

            await bulkUploadFeePayments(formData, token);
            toast.success("Fee payments uploaded successfully!");
            clearFile();
            if (onBatchSuccess) onBatchSuccess();
        } catch (error) {
            console.error("Upload error:", error.response?.data);
            toast.error(error?.response?.data?.message || "Failed to upload fee payments.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 py-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Import Batch Collections</h2>
                <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium">
                    Upload fee payment archives as CSV for systematic ingestion across member accounts.
                </p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <Download className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Structure Reference</p>
                        <p className="text-sm font-bold text-slate-800 tracking-tight">Collection Template</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={handleDownloadTemplate}
                    className="border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white font-bold px-8 h-11 transition-all rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                    Get CSV Structure
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div
                    className={`border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${file
                        ? "border-amber-500 bg-amber-50/10 shadow-inner"
                        : "border-slate-200 bg-slate-50/30 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                    onClick={() => !file && fileInputRef.current?.click()}
                >
                    <Input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {file ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-6 bg-slate-950 rounded-2xl text-white shadow-xl ring-4 ring-slate-100 flex items-center justify-center">
                                <FileCheck className="w-10 h-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-extrabold text-xl text-slate-900 tracking-tight">{file.name}</p>
                                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-[0.2em] bg-amber-50 px-3 py-1 rounded-full">
                                    Archive Synchronized • Ready for Processing
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFile();
                                }}
                                className="text-slate-400 hover:text-rose-500 font-bold h-9 mt-4 px-6 rounded-lg"
                            >
                                <X className="w-4 h-4 mr-1" /> Discard Selection
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-6">
                            <div className="p-8 bg-white rounded-3xl text-slate-200 border-2 border-slate-100 shadow-sm">
                                <FileUp className="w-12 h-12" />
                            </div>
                            <div className="space-y-2">
                                <p className="font-bold text-xl text-slate-800 tracking-tight leading-none">
                                    Drop collection archive here
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    Click to browse your local directory
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center pt-2">
                    <Button
                        type="submit"
                        className="bg-slate-950 hover:bg-slate-900 text-white px-16 h-16 rounded shadow-xl transition-all active:scale-95 disabled:opacity-30 flex items-center gap-3 group border-2 border-slate-950"
                        disabled={loading || !file}
                    >
                        <span className="font-bold text-lg uppercase tracking-tight">{loading ? "Syndicating Data..." : "Engage Bulk Collector"}</span>
                        {!loading && <FileUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default BulkFeePaymentUpload;
