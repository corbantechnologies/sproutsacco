"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

// SACCO Admins
export const createLoanDisbursement = async (values, token) => {
    const response = await apiActions?.post(
        "/api/v1/loandisbursements/",
        values,
        token
    );
    return response?.data;
};
