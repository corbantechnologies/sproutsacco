"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchMemberDetail } from "@/hooks/members/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  Shield,
  Settings,
  Wallet,
  Wallet2,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { apiActions } from "@/tools/axios";
import CreateDepositAdmin from "@/forms/savingsdepostis/CreateDepositAdmin";
import CreateLoanAccountAdmin from "@/forms/loans/CreateLoanAdmin";
import CreateVentureDeposits from "@/forms/venturedeposits/CreateVentureDeposits";
import CreateVenturePayment from "@/forms/venturepayments/CreateVenturePayment";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
import { useFetchMemberSummary } from "@/hooks/summary/actions";
import MemberFinancialSummary from "@/components/members/dashboard/MemberFinancialSummary";
import { downloadMemberSummary } from "@/services/membersummary";
import { Download, Loader2 } from "lucide-react";
import EmptyState from "@/components/general/EmptyState";

function MemberDetail() {
  const { member_no } = useParams();
  const token = useAxiosAuth();
  const {
    isLoading: isLoadingMember,
    data: member,
    refetch: refetchMember,
  } = useFetchMemberDetail(member_no);

  const {
    isLoading: isLoadingSummary,
    data: summary,
    refetch: refetchSummary,
  } = useFetchMemberSummary(member_no);

  const { data: loanProducts } = useFetchLoanProducts();

  const [isApproving, setIsApproving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [loanModal, setLoanModal] = useState(false);
  const [ventureDepositModal, setVentureDepositModal] = useState(false);
  const [venturePaymentModal, setVenturePaymentModal] = useState(false);

  const handleDownloadSummary = async () => {
    if (!member_no) return;
    setIsDownloading(true);
    try {
      const blob = await downloadMemberSummary(member_no, token);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Financial_Summary_${new Date().getFullYear()}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Download started");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download summary");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await apiActions?.patch(
        `/api/v1/auth/approve-member/${member_no}/`,
        {},
        token
      );
      toast.success("Member approved successfully");
      refetchMember();
    } catch (error) {
      toast.error("Failed to approve member. Please try again");
    } finally {
      setIsApproving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Improved: handles string balances like "40000.00"
  const formatBalance = (balance) => {
    if (!balance && balance !== "0.00" && balance !== 0) return "N/A";
    const num = parseFloat(balance);
    if (isNaN(num)) return "N/A";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
      <Icon className="h-5 w-5 text-primary mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold text-foreground truncate">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );

  // Conditional employment section
  const hasEmploymentData =
    member?.employment_type || member?.employer || member?.job_title;

  // Active roles
  const activeRoles = [];
  if (member?.is_staff) activeRoles.push("Staff");
  if (member?.is_member) activeRoles.push("Member");
  if (member?.is_superuser) activeRoles.push("Superuser");
  if (member?.is_sacco_admin) activeRoles.push("SACCO Admin");

  if (isLoadingMember || isLoadingSummary) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-6 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/dashboard">
                Dashboard
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/sacco-admin/members">
                Members
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>
                {member?.first_name} {member?.last_name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Card */}
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                  {getInitials(member?.first_name, member?.last_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {member?.first_name}{" "}
                    {member?.middle_name && member.middle_name + " "}
                    {member?.last_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      Member #{member?.member_no}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDate(member?.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant={member?.is_approved ? "default" : "secondary"}
                    className={
                      member?.is_approved
                        ? "bg-green-600 text-white"
                        : "bg-yellow-600 text-white"
                    }
                  >
                    {member?.is_approved ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <Clock className="h-4 w-4 mr-1" />
                    )}
                    {member?.is_approved ? "Approved" : "Pending Approval"}
                  </Badge>

                  <Badge
                    variant={member?.is_active ? "default" : "destructive"}
                  >
                    {member?.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleDownloadSummary}
                  disabled={isDownloading}
                  className="flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/5"
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download Summary
                </Button>

                {!member?.is_approved && (
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="bg-primary hover:bg-primary/90 text-white px-8"
                  >
                    {isApproving ? "Approving..." : "Approve Member"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="mt-8">
          <MemberFinancialSummary summary={summary} memberNo={member_no} />
        </div>

        {/* Quick Action Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Savings Accounts */}
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Wallet className="h-6 w-6 text-primary" />
                  Savings Accounts
                </CardTitle>
                {member?.is_approved && (
                  <Button
                    onClick={() => setDepositModal(true)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Deposit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {member?.savings?.length > 0 ? (
                member.savings.map((account) => (
                  <InfoField
                    key={account.reference}
                    icon={Wallet2}
                    label={`${account.account_type} - ${account.account_number}`}
                    value={`${formatBalance(account.balance)} KES`}
                  />
                ))
              ) : (
                <div className="py-4">
                  <EmptyState
                    title="No Savings Accounts"
                    message="This member has no active savings accounts."
                    icon={Wallet2}
                    className="border-0 bg-transparent p-0"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Venture Accounts */}
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Wallet className="h-6 w-6 text-primary" />
                  Venture Accounts
                </CardTitle>
                {member?.is_approved && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setVentureDepositModal(true)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Deposit
                    </Button>
                    <Button
                      onClick={() => setVenturePaymentModal(true)}
                      size="sm"
                      variant="destructive"
                    >
                      Pay
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {member?.venture_accounts?.length > 0 ? (
                member.venture_accounts.map((account) => (
                  <InfoField
                    key={account.reference}
                    icon={Wallet2}
                    label={`${account.venture_type} - ${account.account_number}`}
                    value={`${formatBalance(account.balance)} KES`}
                  />
                ))
              ) : (
                <div className="py-4">
                  <EmptyState
                    title="No Venture Accounts"
                    message="This member has no active venture accounts."
                    icon={Wallet}
                    className="border-0 bg-transparent p-0"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loan Accounts */}
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Loan Accounts
                </CardTitle>
                {member?.is_approved && (
                  <Button
                    onClick={() => setLoanModal(true)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Create Loan
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {member?.loan_accounts?.length > 0 ? (
                member.loan_accounts.map((account) => (
                  <InfoField
                    key={account.reference}
                    icon={CreditCard}
                    label={`${account.product} - ${account.account_number}`}
                    value={`${formatBalance(account.outstanding_balance)} KES`}
                  />
                ))
              ) : (
                <div className="py-4">
                  <EmptyState
                    title="No Loan Accounts"
                    message="This member has no active loan accounts."
                    icon={CreditCard}
                    className="border-0 bg-transparent p-0"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <InfoField
                  icon={Mail}
                  label="Email Address"
                  value={member?.email}
                />
                <InfoField
                  icon={Phone}
                  label="Phone Number"
                  value={member?.phone}
                />
                <InfoField
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(member?.dob)}
                />
                <InfoField icon={User} label="Gender" value={member?.gender} />
                <InfoField
                  icon={MapPin}
                  label="County"
                  value={member?.county}
                />
                <InfoField
                  icon={CreditCard}
                  label="Reference Code"
                  value={member?.reference}
                />
              </CardContent>
            </Card>

            {hasEmploymentData && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Building className="h-6 w-6 text-primary" />
                    Employment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <InfoField
                    icon={Building}
                    label="Employment Type"
                    value={member?.employment_type}
                  />
                  <InfoField
                    icon={Building}
                    label="Employer"
                    value={member?.employer}
                  />
                  <InfoField
                    icon={User}
                    label="Job Title"
                    value={member?.job_title}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-5 w-5 text-primary" />
                  Identification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoField
                  icon={CreditCard}
                  label="ID Type"
                  value={member?.id_type}
                />
                <InfoField
                  icon={CreditCard}
                  label="ID Number"
                  value={member?.id_number}
                />
                <InfoField
                  icon={CreditCard}
                  label="Tax PIN"
                  value={member?.tax_pin}
                />
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="h-5 w-5 text-primary" />
                  Roles & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeRoles.length > 0 ? (
                  <div className="space-y-3">
                    {activeRoles.map((role) => (
                      <div
                        key={role}
                        className="flex items-center justify-between p-3 rounded-lg bg-primary/5"
                      >
                        <span className="font-medium">{role}</span>
                        <Badge
                          variant="default"
                          className="bg-primary text-white"
                        >
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4">
                    <EmptyState
                      title="No Special Roles"
                      message="This member has no special roles assigned."
                      icon={Shield}
                      className="border-0 bg-transparent p-0"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="h-5 w-5 text-primary" />
                  Account Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="h-3 w-3 rounded-full bg-green-600"></div>
                  <div>
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(member?.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(member?.updated_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <CreateDepositAdmin
          isOpen={depositModal}
          onClose={() => setDepositModal(false)}
          refetchMember={refetchMember}
          accounts={member?.savings}
        />

        <CreateLoanAccountAdmin
          isOpen={loanModal}
          onClose={() => setLoanModal(false)}
          refetchMember={refetchMember}
          loanProducts={loanProducts}
          member={member}
        />

        <CreateVentureDeposits
          isOpen={ventureDepositModal}
          onClose={() => setVentureDepositModal(false)}
          refetchMember={refetchMember}
          ventures={member?.venture_accounts}
        />

        <CreateVenturePayment
          isOpen={venturePaymentModal}
          onClose={() => setVenturePaymentModal(false)}
          refetchMember={refetchMember}
          ventures={member?.venture_accounts}
        />
      </div>
    </div>
  );
}

export default MemberDetail;
