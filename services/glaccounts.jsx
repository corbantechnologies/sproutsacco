"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

// create
export const createGLAccount = async (values, token) => {
    await apiActions?.post("/api/v1/glaccounts/", values, token);
};

// update
export const updateGLAccount = async (reference, values, token) => {
    const response = await apiActions?.patch(
        `/api/v1/glaccounts/${reference}/`,
        values,
        token
    );
    return response?.data;
};

export const getGLAccounts = async (token) => {
    const response = await apiActions?.get("/api/v1/glaccounts/", token);
    return response?.data?.results;
};

export const getGLAccount = async (reference, token) => {
    const response = await apiActions?.get(
        `/api/v1/glaccounts/${reference}/`,
        token
    );
    return response?.data;
};
