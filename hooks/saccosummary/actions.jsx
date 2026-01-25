"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getSaccoSummary } from "@/services/saccosummary";

export function useFetchSaccoSummary(year) {
  const token = useAxiosAuth();

  return useQuery({
    queryKey: ["saccoSummary", token, year],
    queryFn: () => getSaccoSummary(token, year),
    enabled: !!token,
  });
}
