'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function TransactionForm() {
    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.amount || !formData.date || !formData.description) {
        toast.error('All fields are required.');
        return;
        }

        setLoading(true);
        try {
        const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            ...formData,
            amount: parseFloat(formData.amount), // Convert amount to number
            }),
        });

        if (res.ok) {
            toast.success('Transaction added!');
            setFormData({ amount: '', date: '', description: '' });
        } else {
            toast.error('Failed to add transaction');
        }
        } catch (err) {
        console.error(err);
        toast.error('Something went wrong');
        } finally {
        setLoading(false);
        }
    };

    return (
            <Card className="bg-white shadow-lg rounded-xl">
    <CardHeader>
        <CardTitle>Add New Transaction</CardTitle>
    </CardHeader>
    <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
            />
        </div>

        <div>
            <Label htmlFor="date">Date</Label>
            <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            />
        </div>

        <div>
            <Label htmlFor="description">Description</Label>
            <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            />
        </div>

        <Button className={`w-full bg-indigo-600 hover:bg-indigo-700 ${loading ? 'opacity-50' : ''}`}
            type="submit" 
            disabled={loading}>
            {loading ? 'Adding...' : 'Add Transaction'}
        </Button>
        </form>
    </CardContent>
    </Card>
    );
}
