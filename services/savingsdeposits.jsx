"use client";
import { apiActions, apiMultipartActions } from "@/tools/axios";

// Should not be used
export const createSavingsDeposit = async (values, token) => {
  await apiActions?.post(
    "/api/v1/savingsdeposits/admin/create/",
    values,
    token
  );
};

export const getSavingsDeposits = async (token) => {
  const response = await apiActions?.get("/api/v1/savingsdeposits/", token);
  return response?.data;
};

export const getSavingsDeposit = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/savingsdeposits/${reference}/`,
    token
  );
  return response?.data;
};

export const createBulkSavingsDeposits = async (formData, token) => {
  await apiMultipartActions.post(
    "/api/v1/savingsdeposits/bulk/upload/",
    formData,
    token
  );
};

// Used for Mpesa
export const createSavingsDepositMpesa = async (values, token) => {
  const response = await apiActions?.post(
    "/api/v1/savingsdeposits/",
    values,
    token
  );
  return response?.data;
};
