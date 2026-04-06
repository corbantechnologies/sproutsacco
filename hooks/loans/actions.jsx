"use client";

import { getLoan, getLoans, getLoanPayOffAmount } from "@/services/loanaccounts";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";

export function useFetchLoans() {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loans"],
    queryFn: () => getLoans(token),
  });
}

export function useFetchLoanDetail(reference) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loan", reference],
    queryFn: () => getLoan(reference, token),
    enabled: !!reference,
  });
}

export function useFetchLoanPayOffAmount(reference) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["loan-payoff", reference],
    queryFn: () => getLoanPayOffAmount(reference, token),
    enabled: !!reference,
  });
}
