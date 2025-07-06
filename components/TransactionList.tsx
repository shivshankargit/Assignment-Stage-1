'use client';

import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Transaction = {
    _id: string;
    amount: number;
    date: string;
    description: string;
    category?: string;
    };

    
    export default function TransactionList() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{
        amount?: string;
        date?: string;
        description?: string;
    }>({});


    const fetchTransactions = async () => {
        try {
        setLoading(true);
        const res = await fetch('/api/transactions');
        const data = await res.json();
        setTransactions(data);
        } catch {
        toast.error('Failed to load transactions');
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this transaction?')) return;
        try {
        const res = await fetch(`/api/transactions/${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            toast.success('Deleted!');
            setTransactions(transactions.filter((t) => t._id !== id));
        } else {
            toast.error('Delete failed');
        }
        } catch {
        toast.error('Error deleting');
        }
    };

    const startEditing = (tx: Transaction) => {
        setEditingId(tx._id);
        setEditForm({
        amount: tx.amount.toString(),
        date: tx.date.slice(0, 10),
        description: tx.description,
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEditSubmit = async (id: string) => {
        if (!editForm.amount || !editForm.date || !editForm.description) {
        toast.error('All fields are required.');
        return;
        }

        const amount = parseFloat(editForm.amount);
        if (isNaN(amount)) {
            toast.error('Please enter a valid amount.');
            return;
        }

        try {
        const res = await fetch(`/api/transactions/${id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            amount: amount,
            date: editForm.date,
            description: editForm.description,
            }),
        });
        if (res.ok) {
            toast.success('Updated!');
            fetchTransactions();
            cancelEditing();
        } else {
            toast.error('Update failed');
        }
        } catch {
        toast.error('Error updating');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 space-y-4">
            <h2 className="text-xl font-bold">Transactions</h2>
        
            {loading && <p>Loading...</p>}
        
            {!loading && transactions.length === 0 && (
                <p className="text-muted-foreground text-center italic">
                No transactions yet. Add your first expense!
                </p>
            )}
        
            <ul className="grid gap-4 md:grid-cols-2">
                {transactions.map((tx) => (
                <Card key={tx._id} className="bg-white shadow-lg rounded-xl">
                    {editingId === tx._id ? (
                    <>
                        <CardHeader>
                        <CardTitle>Edit Transaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="space-y-4">
                            <div>
                            <Label htmlFor={`amount-${tx._id}`}>Amount</Label>
                            <Input
                                id={`amount-${tx._id}`}
                                name="amount"
                                type="number"
                                step="0.01"
                                value={editForm.amount ?? ''}
                                onChange={handleEditChange}
                                required
                            />
                            </div>
        
                            <div>
                            <Label htmlFor={`date-${tx._id}`}>Date</Label>
                            <Input
                                id={`date-${tx._id}`}
                                name="date"
                                type="date"
                                value={editForm.date ?? ''}
                                onChange={handleEditChange}
                                required
                            />
                            </div>
        
                            <div>
                            <Label htmlFor={`description-${tx._id}`}>Description</Label>
                            <Input
                                id={`description-${tx._id}`}
                                name="description"
                                value={editForm.description ?? ''}
                                onChange={handleEditChange}
                                required
                            />
                            </div>
        
                            <Button
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => handleEditSubmit(tx._id)}
                            disabled={loading}
                            >
                            Save Changes
                            </Button>
                            <Button
                            variant="secondary"
                            className="w-full"
                            onClick={cancelEditing}
                            >
                            Cancel
                            </Button>
                        </div>
                        </CardContent>
                    </>
                    ) : (
                    <>
                        <CardHeader>
                        <CardTitle>{tx.description}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            ₹{tx.amount.toFixed(2)} on {new Date(tx.date).toLocaleDateString()}
                        </p>
                        </CardHeader>
                        <CardContent className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(tx)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(tx._id)}
                        >
                            Delete
                        </Button>
                        </CardContent>
                    </>
                    )}
                </Card>
                ))}
            </ul>
            </div>
        );
}
