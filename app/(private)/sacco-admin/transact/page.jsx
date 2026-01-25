"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchAccountsList } from "@/hooks/transactions/actions";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Download, Upload, Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AccountsListTable from "@/components/transactions/AccountsListTable";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { downloadAccountsListCSV } from "@/services/transactions";
import toast from "react-hot-toast";
import BulkSavingsAccountsDepositUpload from "@/forms/transactions/BulkSavingsAccountsDepositUpload";
import BulkVentureAccountsDepositUpload from "@/forms/transactions/BulkVentureAccountsDepositUpload";
import BulkVentureAccountsPaymentUpload from "@/forms/transactions/BulkVentureAccountsPaymentUpload";
import BulkLoanRepaymentsUpload from "@/forms/transactions/BulkLoanRepaymentsUpload";
import BulkTamarindLoanInterestUpload from "@/forms/transactions/BulkTamarindLoanInterestUpload";
import BulkCombinedUpload from "@/forms/transactions/BulkCombinedUpload";

function Transactions() {
  const token = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const [isSavingsUploadDialogOpen, setIsSavingsUploadDialogOpen] =
    useState(false);
  const [isVentureUploadDialogOpen, setIsVentureUploadDialogOpen] =
    useState(false);
  const [
    isVenturePaymentUploadDialogOpen,
    setIsVenturePaymentUploadDialogOpen,
  ] = useState(false);
  const [isLoanRepaymentUploadDialogOpen, setIsLoanRepaymentUploadDialogOpen] =
    useState(false);
  const [isLoanInterestUploadDialogOpen, setIsLoanInterestUploadDialogOpen] =
    useState(false);
  const [isCombinedUploadDialogOpen, setIsCombinedUploadDialogOpen] =
    useState(false);
  const {
    isLoading: isLoadingAccountsList,
    data: accountsList,
    refetch: refetchAccountsList,
  } = useFetchAccountsList();

  const handleDownload = async (interestOnly = false) => {
    setLoading(true);
    try {
      await downloadAccountsListCSV(token, interestOnly);
    } catch (error) {
      toast.error(error.message || "Failed to download CSV");
      console.error("Error downloading CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingAccountsList) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-6 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/dashboard">
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/transact">
                <BreadcrumbPage>Transact</BreadcrumbPage>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Headers */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ea1315]">
              Accounts & Transactions
            </h1>
            <p className="text-gray-500 mt-1">
              Manage accounts and transactions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="bg-[#045e32] hover:bg-[#022007] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
                  disabled={loading}
                >
                  <Menu className="mr-2 h-4 w-4" />
                  Transaction Actions
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleDownload(false)}
                    disabled={loading}
                    variant="ghost"
                    className="justify-start text-left"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Account List
                  </Button>
                  {/* <Button
                    onClick={() => handleDownload(true)}
                    disabled={loading}
                    variant="ghost"
                    className="justify-start text-left"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Interest Transactions
                  </Button> */}
                  {/* <Button
                    onClick={() => setIsSavingsUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Savings Deposit Upload
                  </Button> */}
                  {/* <Button
                    onClick={() => setIsVentureUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Venture Deposit Upload
                  </Button> */}
                  {/* <Button
                    onClick={() => setIsVenturePaymentUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Venture Payment Upload
                  </Button> */}
                  {/* <Button
                    onClick={() => setIsLoanRepaymentUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Bulk Loan Repayments Upload
                  </Button> */}
                  {/* <Button
                    onClick={() => setIsLoanInterestUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Bulk Loan Interest Upload
                  </Button> */}
                  <Button
                    onClick={() => setIsCombinedUploadDialogOpen(true)}
                    variant="ghost"
                    className="justify-start text-left"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload - Savings & Ventures
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Accounts List Table */}
        {accountsList ? (
          <AccountsListTable accountsList={accountsList} />
        ) : (
          <div className="text-center text-gray-500">No accounts available</div>
        )}

        {/* Bulk Upload Dialogs */}
        <BulkSavingsAccountsDepositUpload
          isOpen={isSavingsUploadDialogOpen}
          onClose={() => setIsSavingsUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
        <BulkVentureAccountsDepositUpload
          isOpen={isVentureUploadDialogOpen}
          onClose={() => setIsVentureUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
        <BulkVentureAccountsPaymentUpload
          isOpen={isVenturePaymentUploadDialogOpen}
          onClose={() => setIsVenturePaymentUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
        <BulkLoanRepaymentsUpload
          isOpen={isLoanRepaymentUploadDialogOpen}
          onClose={() => setIsLoanRepaymentUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
        <BulkTamarindLoanInterestUpload
          isOpen={isLoanInterestUploadDialogOpen}
          onClose={() => setIsLoanInterestUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
        <BulkCombinedUpload
          isOpen={isCombinedUploadDialogOpen}
          onClose={() => setIsCombinedUploadDialogOpen(false)}
          refetchTransactions={refetchAccountsList}
        />
      </div>
    </div>
  );
}

export default Transactions;
