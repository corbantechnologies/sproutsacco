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
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function CashBook({ data }) {
    if (!data) return null;

    const { transactions, opening_balance, closing_balance, start_date, end_date } =
        data;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Cash Book</CardTitle>
                        <CardDescription>
                            {new Date(start_date).toLocaleDateString()} -{" "}
                            {new Date(end_date).toLocaleDateString()}
                        </CardDescription>
                    </div>
                    <div className="flex gap-6 text-right">
                        <div>
                            <p className="text-sm text-muted-foreground">Opening Balance</p>
                            <p className="font-semibold">{formatCurrency(opening_balance)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Closing Balance</p>
                            <p className="font-bold text-xl text-primary">
                                {formatCurrency(closing_balance)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Debit (In)</TableHead>
                            <TableHead className="text-right">Credit (Out)</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Opening Balance Row */}
                        <TableRow className="bg-muted/10">
                            <TableCell colSpan={6} className="font-medium italic text-muted-foreground">
                                Opening Balance
                            </TableCell>
                            <TableCell className="text-right font-medium text-muted-foreground">
                                {formatCurrency(opening_balance)}
                            </TableCell>
                        </TableRow>

                        {transactions.map((tx, idx) => {
                            const isDebit = tx.type === "Debit";
                            return (
                                <TableRow key={idx}>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(tx.date).toLocaleDateString()}{" "}
                                        <span className="text-xs text-muted-foreground block">
                                            {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{tx.category}</div>
                                        <div className="text-xs text-muted-foreground">{tx.description}</div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{tx.reference || "-"}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={isDebit ? "default" : "secondary"}
                                            className={
                                                isDebit
                                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                            }
                                        >
                                            {isDebit ? <ArrowDownCircle className="w-3 h-3 mr-1" /> : <ArrowUpCircle className="w-3 h-3 mr-1" />}
                                            {tx.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-green-700 font-medium">
                                        {isDebit ? formatCurrency(tx.amount) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right text-red-700 font-medium">
                                        {!isDebit ? formatCurrency(tx.amount) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(tx.running_balance)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {transactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No transactions found for this period.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
