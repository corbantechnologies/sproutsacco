"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";

// create
export const createJournalBatch = async (values, token) => {
    await apiActions?.post("/api/v1/journalbatches/", values, token);
};

// update
export const updateJournalBatch = async (reference, values, token) => {
    const response = await apiActions?.patch(
        `/api/v1/journalbatches/${reference}/`,
        values,
        token
    );
    return response?.data;
};

export const getJournalBatches = async (token) => {
    const response = await apiActions?.get("/api/v1/journalbatches/", token);
    return response?.data?.results;
};

export const getJournalBatch = async (reference, token) => {
    const response = await apiActions?.get(
        `/api/v1/journalbatches/${reference}/`,
        token
    );
    return response?.data;
};
