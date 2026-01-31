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
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function BalanceSheet({ data }) {
    if (!data) return null;

    const { assets, liabilities, equity, as_of } = data;

    const SectionRow = ({ label, value, isTotal = false }) => (
        <TableRow className={isTotal ? "font-bold bg-muted/50" : ""}>
            <TableCell>{label}</TableCell>
            <TableCell className="text-right">{formatCurrency(value)}</TableCell>
        </TableRow>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>As of {new Date(as_of).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Assets */}
                    <div>
                        <h3 className="font-semibold mb-2 text-lg text-primary">Assets</h3>
                        <Table>
                            <TableBody>
                                <SectionRow label="Cash Equivalents" value={assets.cash_equivalents} />
                                <SectionRow label="Loans Receivable" value={assets.loans_receivable} />
                                <SectionRow
                                    label="Total Assets"
                                    value={assets.total_assets}
                                    isTotal
                                />
                            </TableBody>
                        </Table>
                    </div>

                    {/* Liabilities */}
                    <div>
                        <h3 className="font-semibold mb-2 text-lg text-primary">Liabilities</h3>
                        <Table>
                            <TableBody>
                                <SectionRow label="Member Savings" value={liabilities.member_savings} />
                                <SectionRow label="Venture Funds" value={liabilities.venture_funds} />
                                <SectionRow
                                    label="Total Liabilities"
                                    value={liabilities.total_liabilities}
                                    isTotal
                                />
                            </TableBody>
                        </Table>
                    </div>

                    {/* Equity */}
                    <div>
                        <h3 className="font-semibold mb-2 text-lg text-primary">Equity</h3>
                        <Table>
                            <TableBody>
                                <SectionRow label="Retained Earnings / Equity" value={equity} isTotal />
                            </TableBody>
                        </Table>
                    </div>

                    <div className="pt-4 border-t">
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total Liabilities & Equity</span>
                            <span>{formatCurrency(liabilities.total_liabilities + equity)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
