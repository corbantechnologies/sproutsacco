"use client";

import { apiActions } from "@/tools/axios";

// SACCO Admins
// create loan type
export const createLoanProduct = async (values, token) => {
  await apiActions?.post("/api/v1/loanproducts/", values, token);
};

// get loan types
export const getLoanProducts = async (token) => {
  const response = await apiActions?.get("/api/v1/loanproducts/", token);
  return response?.data?.results || [];
};

// get loan type detail by reference
export const getLoanProductDetail = async (reference, token) => {
  const response = await apiActions?.get(
    `/api/v1/loanproducts/${reference}/`,
    token
  );
  return response?.data;
};

// update loan type: to be used rarely
export const updateLoanProduct = async (reference, formData, token) => {
  const response = await apiActions?.patch(
    `/api/v1/loanproducts/${reference}/`,
    formData,
    token
  );
  return response?.data;
};
