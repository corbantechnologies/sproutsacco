"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { bulkUploadLoanDisbursements, downloadLoanDisbursementsTemplate } from "@/services/loandisbursements";
import { FileUp, X, Download, FileCheck } from "lucide-react";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

function BulkLoanDisbursementUpload({ onBatchSuccess }) {
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
            await downloadLoanDisbursementsTemplate(token);
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

            await bulkUploadLoanDisbursements(formData, token);
            toast.success("Disbursements uploaded successfully!");
            clearFile();
            if (onBatchSuccess) onBatchSuccess();
        } catch (error) {
            console.error("Upload error:", error.response?.data);
            toast.error(error?.response?.data?.message || "Failed to upload disbursements.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 py-4">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-blue-800">Bulk Disburse Approved Loans</h2>
                <p className="text-slate-500 text-sm max-w-lg mx-auto">
                    Export pending disbursements to CSV, complete the payment methods, and upload here to fund multiple members at once.
                </p>
            </div>

            <div className="bg-blue-50/50 rounded p-6 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded shadow-sm border border-blue-50">
                        <Download className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800 uppercase tracking-tighter">Disbursement Template</p>
                        <p className="text-[11px] text-slate-500 font-medium italic">Pre-filled with all currently approved but unfunded loans.</p>
                    </div>
                </div>
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleDownloadTemplate}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 h-10 shadow-md shadow-blue-100 transition-all rounded"
                >
                    Get Pre-filled Template
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div
                    className={`border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${file
                        ? "border-blue-500 bg-blue-50/20"
                        : "border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/5"
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
                        <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95">
                            <div className="p-5 bg-blue-600 rounded text-white shadow-lg ring-4 ring-blue-50">
                                <FileCheck className="w-10 h-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-extrabold text-xl text-slate-900 tracking-tight">{file.name}</p>
                                <p className="text-[12px] text-blue-600 font-semibold uppercase tracking-[0.2em]">
                                    {(file.size / 1024).toFixed(2)} KB • DISBURSEMENT DATA READY
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFile();
                                }}
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold h-9 mt-4 px-6 rounded"
                            >
                                <X className="w-4 h-4 mr-1" /> Reset File
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-5">
                            <div className="p-6 bg-slate-50 rounded text-blue-300 border-2 border-white shadow-md">
                                <FileUp className="w-12 h-12" />
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold text-xl text-slate-800 tracking-tight">
                                    Upload Disbursement CSV
                                </p>
                                <p className="text-sm text-slate-400 font-medium">
                                    Click to select or drag and drop your file
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center pt-2">
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-20 h-14 rounded font-semibold text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-30 uppercase tracking-tight"
                        disabled={loading || !file}
                    >
                        {loading ? "Funding Loans..." : "Start Disbursement"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default BulkLoanDisbursementUpload;
