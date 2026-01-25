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
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import useUserMemberNo from "@/hooks/authentication/useUserMemberNo";
import { ChevronLeft, ChevronRight, FileText, User } from "lucide-react";

export default function AdminLoanApplications() {
  const { data: loanApplications, isLoading } = useFetchLoanApplications();
  const userMemberNo = useUserMemberNo();

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'mine'
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) return <MemberLoadingSpinner />;

  // 1. Filter by Tab (Ownership)
  let filteredApps = loanApplications || [];
  if (activeTab === "mine") {
    filteredApps = filteredApps.filter((app) => app.member === userMemberNo);
  }

  // 2. Filter by Status
  if (statusFilter !== "all") {
    filteredApps = filteredApps.filter((app) => app.status === statusFilter);
  }

  // 3. Pagination Logic
  const totalItems = filteredApps.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = filteredApps.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
      case "Disbursed":
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case "Rejected":
      case "Declined":
        return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      case "In Progress":
      case "Amended":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      case "Ready for Submission":
      case "Submitted":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
    }
  };

  const uniqueStatuses = [
    "In Progress",
    "Submitted",
    "Approved",
    "Declined",
    "Disbursed",
    "Ready for Submission",
    "Amended",
    "Rejected",
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto p-4 sm:p-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Loan Applications</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Loan Applications
              </h1>
              <p className="text-muted-foreground mt-1">
                Review and manage member loan applications
              </p>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center bg-white p-4 rounded-lg border shadow-sm">
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All Applications
              </button>
              <button
                onClick={() => {
                  setActiveTab("mine");
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "mine"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                My Applications
              </button>
            </div>

            {/* Filters */}
            <div className="w-full sm:w-[200px]">
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle>
                {activeTab === "all" ? "All Applications" : "My Applications"}
              </CardTitle>
              <CardDescription>
                Showing {paginatedApps.length} of {totalItems} applications
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!paginatedApps || paginatedApps.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No applications found
                </h3>
                <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                  {statusFilter !== "all"
                    ? `No applications found with status "${statusFilter}". Try changing the filter.`
                    : activeTab === "mine"
                    ? "You haven't created any loan applications yet."
                    : "No loan applications exist in the system."}
                </p>
                {statusFilter !== "all" && (
                  <Button
                    variant="outline"
                    onClick={() => setStatusFilter("all")}
                    className="mt-4"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            ) : (
              <div className="border-t">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 block sm:table-row">
                      <TableHead className="hidden sm:table-cell">
                        Reference
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Applicant
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Product
                      </TableHead>
                      <TableHead className="hidden sm:table-cell text-right">
                        Amount
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="hidden sm:table-cell text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApps.map((app) => (
                      <TableRow
                        key={app.reference}
                        className="block sm:table-row p-4 sm:p-0 border-b last:border-0 hover:bg-gray-50/50"
                      >
                        {/* Mobile View: Flexible Layout */}
                        <TableCell className="sm:hidden w-full block border-none p-0 pb-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-mono text-xs text-muted-foreground">
                              {app.reference}
                            </span>
                            <Badge
                              className={`font-normal scale-90 origin-right ${getStatusColor(
                                app.status
                              )}`}
                              variant="secondary"
                            >
                              {app.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium text-gray-900">
                                {app.product}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {app.member_name || app.member}
                              </div>
                            </div>
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(app.requested_amount)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-dashed mt-2">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(app.created_at), "MMM dd, yyyy")}
                            </span>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs border-[#045e32] text-[#045e32]"
                            >
                              <Link
                                href={`/sacco-admin/loan-applications/${app.reference}`}
                              >
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </TableCell>

                        {/* Desktop View */}
                        <TableCell className="hidden sm:table-cell font-mono text-sm font-medium text-gray-900">
                          {app.reference}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {app.member_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {app.member}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell font-medium">
                          {app.product}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-right font-medium">
                          {formatCurrency(app.requested_amount)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {format(new Date(app.created_at), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            className={`font-normal ${getStatusColor(
                              app.status
                            )}`}
                            variant="outline"
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-right">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Link
                              href={`/sacco-admin/loan-applications/${app.reference}`}
                              className="flex items-center justify-center"
                            >
                              <ChevronRight className="h-4 w-4 text-gray-400 hover:text-[#045e32]" />
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

          {/* Pagination */}
          {totalItems > 0 && (
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, totalItems)}
                </span>{" "}
                of <span className="font-medium">{totalItems}</span>{" "}
                applications
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
