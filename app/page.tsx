import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-10">
      <header className="bg-indigo-600 text-white p-4 text-center rounded-b-lg shadow-md">
      <h1 className="text-3xl font-bold">💰 Personal Finance Tracker</h1>
      <p className="text-sm opacity-90">Track your expenses and budget with ease</p>
    </header>
      <TransactionForm/>
      <TransactionList/>
      <MonthlyExpensesChart/>
    </main>
  );
}
