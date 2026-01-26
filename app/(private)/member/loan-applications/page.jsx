"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useFetchLoanApplications } from "@/hooks/loanapplications/actions";
import MemberLoadingSpinner from "@/components/general/MemberLoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Plus, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CreateLoanApplication } from "@/forms/loanapplications/CreateLoanApplication";

export default function LoanApplications() {
    const { data: loanApplications, isLoading, refetch } = useFetchLoanApplications();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    if (isLoading) return <MemberLoadingSpinner />;

    // Handle initial loading or empty states gracefully
    const applications = loanApplications

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
            case "Disbursed":
                return "bg-green-100 text-green-700 hover:bg-green-200";
            case "Rejected":
            case "Declined":
                return "bg-red-100 text-red-700 hover:bg-red-200";
            case "In Progress":
            case "Amended":
                return "bg-blue-100 text-blue-700 hover:bg-blue-200";
            case "Ready for Submission":
                return "bg-purple-100 text-purple-700 hover:bg-purple-200";
            default:
                return "bg-gray-100 text-gray-700 hover:bg-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="mx-auto p-4 sm:p-6 space-y-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/member/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Loan Applications</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Loan Applications</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and track your loan requests
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#045e32] hover:bg-[#034625]"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Application
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                        <CardDescription>
                            A list of your recent loan applications and their status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {applications?.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                                <p className="text-muted-foreground">No loan applications found.</p>
                                <Button
                                    variant="link"
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="text-[#045e32] mt-2"
                                >
                                    Start your first application
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead>Reference</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Requested Amount</TableHead>
                                            <TableHead>Date Applied</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {applications?.map((app) => (
                                            <TableRow key={app.reference}>
                                                <TableCell className="font-mono text-sm">
                                                    {app.reference}
                                                </TableCell>
                                                <TableCell>{app.product}</TableCell>
                                                <TableCell>
                                                    {formatCurrency(app.requested_amount)}
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(app.created_at), "MMM dd, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`font-normal ${getStatusColor(
                                                            app.status
                                                        )}`}
                                                        variant="secondary"
                                                    >
                                                        {app.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-[#045e32] hover:text-[#045e32] hover:bg-green-50"
                                                    >
                                                        <Link href={`/member/loan-applications/${app.reference}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Custom Modal for Loan Application */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">New Loan Application</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="h-8 w-8 rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <CreateLoanApplication
                                onSuccess={() => {
                                    setIsCreateModalOpen(false);
                                }}
                                memberPath="member"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}