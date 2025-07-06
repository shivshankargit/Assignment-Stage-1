'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

type Transaction = {
    _id: string;
    amount: number;
    date: string;
    description: string;
    category?: string;
    };

    type MonthlyData = {
    month: string;
    total: number;
    };

    export default function MonthlyExpensesChart() {
    const [data, setData] = useState<MonthlyData[]>([]);

    const fetchData = async () => {
        try {
        const res = await fetch('/api/transactions');
        const transactions: Transaction[] = await res.json();

        // Group by month
        const monthlyTotals: Record<string, number> = {};
        transactions.forEach((tx) => {
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + tx.amount;
        });

        // Convert to array
        const chartData: MonthlyData[] = Object.entries(monthlyTotals)
            .map(([month, total]) => ({ month, total }))
            .sort((a, b) => a.month.localeCompare(b.month));

        setData(chartData);
        } catch (err) {
        console.error(err);
        toast.error('Failed to load chart data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card className="bg-white shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                <p className="text-muted-foreground text-center">No data to display yet.</p>
                ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                )}
            </CardContent>
            </Card>
        );
}
