"use client";

import { apiActions } from "@/tools/axios";

// SACCO ADMINS
// create fee type
export const createFeeType = async (values, token) => {
    await apiActions?.post("/api/v1/feetypes/", values, token);
};

// get fee types
export const getFeeTypes = async (token) => {
    const response = await apiActions?.get("/api/v1/feetypes/", token);
    return response?.data?.results;
};

// get fee type detail by reference
export const getFeeTypeDetail = async (reference, token) => {
    const response = await apiActions?.get(
        `/api/v1/feetypes/${reference}/`,
        token
    );
    return response?.data;
};

// update fee type
export const updateFeeType = async (reference, formData, token) => {
    const response = await apiActions?.patch(
        `/api/v1/feetypes/${reference}/`,
        formData,
        token
    );
    return response?.data;
};
