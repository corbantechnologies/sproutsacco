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
import { Badge } from "@/components/ui/badge";

export default function DebtorsList({ data }) {
    if (!data) return null;

    const { debtors, total_outstanding, generated_at } = data;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Debtors Report</CardTitle>
                        <CardDescription>
                            As of {new Date(generated_at).toLocaleString()}
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Outstanding</p>
                        <p className="text-xl font-bold text-red-600">
                            {formatCurrency(total_outstanding)}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Account No</TableHead>
                            <TableHead>Loan Product</TableHead>
                            <TableHead className="text-right">Principal</TableHead>
                            <TableHead className="text-right">Outstanding</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {debtors.map((debtor) => (
                            <TableRow key={debtor.account_number}>
                                <TableCell className="font-medium">
                                    <div>{debtor.member_name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {debtor.member_no}
                                    </div>
                                </TableCell>
                                <TableCell>{debtor.account_number}</TableCell>
                                <TableCell>{debtor.loan_product}</TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(debtor.principal)}
                                </TableCell>
                                <TableCell className="text-right font-bold">
                                    {formatCurrency(debtor.outstanding_balance)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{debtor.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {debtors.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No debtors found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
