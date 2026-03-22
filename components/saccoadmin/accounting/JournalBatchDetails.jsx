"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Re-checking where Dialog is imported from in other files
// In SetupPage it wasn't used, but usually it's @/components/ui/dialog

export default function JournalBatchDetails({ isOpen, onClose, batch }) {
    if (!batch) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Batch Details: {batch.code}</span>
                        <Badge variant={batch.posted ? "success" : "secondary"}>
                            {batch.posted ? "Posted" : "Draft"}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        {batch.description}
                        <div className="mt-1 text-xs text-slate-500">
                            Reference: {batch.reference} | Date: {batch.created_at && format(new Date(batch.created_at), "PPP p")}
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="text-xs font-bold">Entry Code</TableHead>
                                <TableHead className="text-xs font-bold">Account</TableHead>
                                <TableHead className="text-xs font-bold text-right">Debit</TableHead>
                                <TableHead className="text-xs font-bold text-right">Credit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batch.entries?.map((entry) => (
                                <TableRow key={entry.id || entry.reference}>
                                    <TableCell className="text-xs font-medium">{entry.code}</TableCell>
                                    <TableCell className="text-xs">
                                        <div className="font-semibold">{entry.account}</div>
                                        <div className="text-[10px] text-slate-500">{entry.account_details?.code}</div>
                                    </TableCell>
                                    <TableCell className="text-xs text-right font-mono">
                                        {Number(entry.debit) > 0 ? Number(entry.debit).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                                    </TableCell>
                                    <TableCell className="text-xs text-right font-mono">
                                        {Number(entry.credit) > 0 ? Number(entry.credit).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
