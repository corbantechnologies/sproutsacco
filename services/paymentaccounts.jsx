"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

// create
export const createPaymentAccount = async (values, token) => {
    await apiActions?.post("/api/v1/paymentaccounts/", values, token);
};

// update
export const updatePaymentAccount = async (reference, values, token) => {
    const response = await apiActions?.patch(
        `/api/v1/paymentaccounts/${reference}/`,
        values,
        token
    );
    return response?.data;
};

export const getPaymentAccounts = async (token) => {
    const response = await apiActions?.get("/api/v1/paymentaccounts/", token);
    return response?.data?.results;
};

export const getPaymentAccount = async (reference, token) => {
    const response = await apiActions?.get(
        `/api/v1/paymentaccounts/${reference}/`,
        token
    );
    return response?.data;
};
