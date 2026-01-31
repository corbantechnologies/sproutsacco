import React from "react";
import { formatCurrency } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

export default function PnLReport({ data }) {
    if (!data) return null;

    const { income, expenses, net_income, period } = data;

    const EntryRow = ({ label, value, isTotal = false, indent = false }) => (
        <TableRow className={isTotal ? "font-bold bg-muted/50" : ""}>
            <TableCell className={indent ? "pl-8" : ""}>{label}</TableCell>
            <TableCell className="text-right">{formatCurrency(value)}</TableCell>
        </TableRow>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profit & Loss Statement</CardTitle>
                <CardDescription>
                    From {new Date(period.start).toLocaleDateString()} to{" "}
                    {new Date(period.end).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        {/* Income Section */}
                        <TableRow className="bg-muted/20">
                            <TableCell colSpan={2} className="font-semibold text-primary">
                                Income
                            </TableCell>
                        </TableRow>
                        <EntryRow
                            label="Gross Loan Repayments (Interest)"
                            value={income.loan_repayments_gross}
                            indent
                        />
                        {/* Add other income sources here if available in future */}
                        <EntryRow label="Total Income" value={income.total_income} isTotal />

                        {/* Expenses Section */}
                        <TableRow className="bg-muted/20">
                            <TableCell colSpan={2} className="font-semibold text-primary pt-6">
                                Expenses
                            </TableCell>
                        </TableRow>
                        <EntryRow
                            label="Venture Payouts"
                            value={expenses.venture_payouts}
                            indent
                        />
                        {/* Add other expenses here if available in future */}
                        <EntryRow
                            label="Total Expenses"
                            value={expenses.total_expenses}
                            isTotal
                        />

                        {/* Net Income */}
                        <TableRow className="bg-primary/5 border-t-2 border-primary">
                            <TableCell className="font-bold text-lg text-primary">
                                Net Income
                            </TableCell>
                            <TableCell className="text-right font-bold text-lg text-primary">
                                {formatCurrency(net_income)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
