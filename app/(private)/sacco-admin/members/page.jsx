"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import SaccoMembersTable from "@/components/members/SaccoMembersTable";
import StatsCard from "@/components/saccoadmin/StatsCard";
import { Button } from "@/components/ui/button";
import CreateMember from "@/forms/members/CreateMember";
import { useFetchMembers } from "@/hooks/members/actions";
import { User, Users } from "lucide-react";
import React, { useState } from "react";

function Members() {
  const [memberCreateModal, setMemberCreateModal] = useState(false);
  const {
    isLoading: isLoadingMembers,
    data: members,
    refetch: refetchMembers,
  } = useFetchMembers();

  if (isLoadingMembers) return <LoadingSpinner />;

  // Calculate pending approvals
  const pendingApprovals =
    members?.filter((member) => !member?.is_approved).length || 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold ">
              Members
            </h1>
            <p className="text-gray-500 mt-1">Manage your members</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              onClick={() => setMemberCreateModal(true)}
              className="bg-primary hover:bg-[#022007] text-white text-sm sm:text-base py-2 px-3 sm:px-4 flex-1 sm:flex-none"
            >
              <User className="h-4 w-4 mr-2" /> New Member
            </Button>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <StatsCard
            title="Total Members"
            value={members?.length || 0}
            Icon={Users}
            description="Active members in the system"
          />
          <StatsCard
            title="Pending Approvals"
            value={pendingApprovals}
            Icon={Users}
            description="Members awaiting approval"
          />
        </div>

        {/* Members Table */}
        <SaccoMembersTable members={members} refetchMembers={refetchMembers} />

        {/* Member Create Modal */}
        <CreateMember
          openModal={memberCreateModal}
          closeModal={() => setMemberCreateModal(false)}
        />
      </div>
    </div>
  );
}

export default Members;
