"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

// create
export const createFeePayment = async (values, token) => {
    await apiActions?.post("/api/v1/feepayments/", values, token);
};

export const getFeePayments = async (token) => {
    const response = await apiActions?.get("/api/v1/feepayments/", token);
    return response?.data?.results;
};

export const getFeePayment = async (reference, token) => {
    const response = await apiActions?.get(
        `/api/v1/feepayments/${reference}/`,
        token
    );
    return response?.data;
};

