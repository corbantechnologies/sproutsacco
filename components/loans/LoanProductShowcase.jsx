"use client";

import React from "react";
import { useFetchLoanProducts } from "@/hooks/loanproducts/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HandCoins, Info, Percent, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function LoanProductShowcase({ showTitle = true }) {
  const { data: loanProducts, isLoading } = useFetchLoanProducts();

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[280px] h-48 bg-slate-100 animate-pulse rounded-xl border border-slate-200" />
        ))}
      </div>
    );
  }

  if (!loanProducts || loanProducts.length === 0) return null;

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center gap-2">
          <HandCoins className="w-5 h-5 text-[#236c2e]" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Available Loan Products</h2>
        </div>
      )}
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {loanProducts.map((product) => (
          <Card 
            key={product.reference} 
            className="min-w-[300px] snap-center border-slate-200 hover:border-[#236c2e]/30 hover:shadow-md transition-all duration-300"
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-emerald-50 text-[#236c2e]">
                  <Wallet className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-bold text-[#236c2e] border-emerald-100 bg-emerald-50/30">
                  {product.interest_method}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold mt-3">{product.name}</CardTitle>
              <CardDescription className="text-xs">Automated Repayment Schedules</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Interest Rate</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-slate-900">{product.interest_rate}%</span>
                    <span className="text-[10px] text-slate-500 font-medium">/ year</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Processing Fee</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-slate-900">{product.processing_fee}%</span>
                    <span className="text-[10px] text-slate-500 font-medium">flat</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-dashed flex items-center gap-2">
                <Info className="w-3 h-3 text-slate-400" />
                <p className="text-[10px] font-medium text-slate-500">
                  Calculated using {product.interest_method.toLowerCase()} basis
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
