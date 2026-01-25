"use client";

import React, { useState } from "react";
import { useFetchMember, useFetchMembers } from "@/hooks/members/actions";
import { useFetchSavingsTypes } from "@/hooks/savingtypes/actions";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
import { useFetchVentureTypes } from "@/hooks/venturetypes/actions";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Wallet,
  CreditCard,
  TrendingUp,
  Plus,
  Loader2,
} from "lucide-react";

import SaccoMembersTable from "@/components/members/SaccoMembersTable";
import CreateMember from "@/forms/members/CreateMember";
import CreateSavingTypeModal from "@/forms/savingtypes/CreateSavingType";
import CreateLoanProduct from "@/forms/loanproducts/CreateLoanProduct";
import CreateVentureType from "@/forms/venturetypes/CreateVentureType";
import LoadingSpinner from "@/components/general/LoadingSpinner";

export default function SaccoAdminDashboard() {
  const { data: myself, isLoading: isLoadingMyself } = useFetchMember();
  const {
    data: members,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = useFetchMembers();
  const {
    data: savingTypes,
    isLoading: isLoadingSavingTypes,
    refetch: refetchSavingTypes,
  } = useFetchSavingsTypes();
  const {
    data: loanProducts,
    isLoading: isLoadingLoanProducts,
    refetch: refetchLoanProducts,
  } = useFetchLoanProducts();
  const {
    data: ventureTypes,
    isLoading: isLoadingVentureTypes,
    refetch: refetchVentureTypes,
  } = useFetchVentureTypes();

  const [createMemberOpen, setCreateMemberOpen] = useState(false);
  const [createSavingTypeOpen, setCreateSavingTypeOpen] = useState(false);
  const [createLoanProductOpen, setCreateLoanProductOpen] = useState(false);
  const [createVentureTypeOpen, setCreateVentureTypeOpen] = useState(false);

  if (
    isLoadingMyself ||
    isLoadingMembers ||
    isLoadingSavingTypes ||
    isLoadingLoanProducts ||
    isLoadingVentureTypes
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage members, products, and configurations.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border shadow-sm">
          <p className="text-sm font-medium text-gray-900">
            {myself?.salutation} {myself?.last_name} (Admin)
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Members
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saving Types
            </CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingTypes?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Loan Products
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loanProducts?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Venture Types
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ventureTypes?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px] h-auto bg-white border">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="savings">Saving Types</TabsTrigger>
          <TabsTrigger value="loans">Loan Products</TabsTrigger>
          <TabsTrigger value="ventures">Venture Types</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="pt-6">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setCreateMemberOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>
          <SaccoMembersTable members={members} />
        </TabsContent>

        {/* Saving Types Tab */}
        <TabsContent value="savings" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Saving Types</CardTitle>
              <Button
                size="sm"
                onClick={() => setCreateSavingTypeOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Type
              </Button>
            </CardHeader>
            <CardContent>
              {savingTypes?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Can Guarantee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savingTypes.map((type) => (
                      <TableRow key={type.id || type.reference}>
                        <TableCell className="font-medium">
                          {type.name}
                        </TableCell>
                        <TableCell>{type.interest_rate}%</TableCell>
                        <TableCell>{type.description || "-"}</TableCell>
                        <TableCell>
                          {type.can_guarantee ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No saving types found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loan Products Tab */}
        <TabsContent value="loans" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Loan Products</CardTitle>
              <Button
                size="sm"
                onClick={() => setCreateLoanProductOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Product
              </Button>
            </CardHeader>
            <CardContent>
              {loanProducts?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanProducts.map((product) => (
                      <TableRow key={product.id || product.reference}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.interest_rate}%</TableCell>
                        <TableCell>{product.description || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No loan products found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Venture Types Tab */}
        <TabsContent value="ventures" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Venture Types</CardTitle>
              <Button
                size="sm"
                onClick={() => setCreateVentureTypeOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Type
              </Button>
            </CardHeader>
            <CardContent>
              {ventureTypes?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ventureTypes.map((type) => (
                      <TableRow key={type.id || type.reference}>
                        <TableCell className="font-medium">
                          {type.name}
                        </TableCell>
                        <TableCell>{type.interest_rate}%</TableCell>
                        <TableCell>{type.description || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No venture types found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateMember
        openModal={createMemberOpen}
        closeModal={() => {
          setCreateMemberOpen(false);
          refetchMembers();
        }}
      />
      <CreateSavingTypeModal
        isOpen={createSavingTypeOpen}
        onClose={() => setCreateSavingTypeOpen(false)}
        refetchSavingTypes={refetchSavingTypes}
      />
      <CreateLoanProduct
        isOpen={createLoanProductOpen}
        onClose={() => setCreateLoanProductOpen(false)}
        refetchLoanTypes={refetchLoanProducts}
      />
      <CreateVentureType
        isOpen={createVentureTypeOpen}
        onClose={() => setCreateVentureTypeOpen(false)}
        refetchVentureTypes={refetchVentureTypes}
      />
    </div>
  );
}
