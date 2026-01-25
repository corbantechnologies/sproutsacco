"use client";

import { getLoan, getLoans } from "@/services/loanaccounts";
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
