/**
 * Trip spend tracker — log ACTUAL expenses during the trip and compare them
 * against the AI budget estimate. Closes the biggest gap vs apps like
 * TravelSpend / Splitwise / Wanderlog: estimates tell you what a trip *should*
 * cost; this tells you what it *is* costing, and who owes whom.
 *
 * Local-first: expenses persist per-trip in localStorage (same model as the
 * journal and readiness state). Amounts are in the traveller's home currency.
 */

const KEY_PREFIX = 'adventure-planner:expenses:';

export type ExpenseCategory = 'food' | 'transport' | 'activities' | 'accommodation' | 'shopping' | 'other';

export const EXPENSE_CATEGORIES: { id: ExpenseCategory; label: string; icon: string }[] = [
  { id: 'food', label: 'Food & drink', icon: '🍜' },
  { id: 'transport', label: 'Transport', icon: '🚕' },
  { id: 'activities', label: 'Activities', icon: '🎟️' },
  { id: 'accommodation', label: 'Stay', icon: '🏨' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'other', label: 'Other', icon: '💳' },
];

export interface Expense {
  id: string;
  amount: number;          // home-currency units (whole-trip group spend, not per person)
  category: ExpenseCategory;
  note?: string;
  date: string;            // YYYY-MM-DD
  paidBy?: string;         // traveller display name
  createdAt: number;
}

function key(tripId: string): string {
  return KEY_PREFIX + tripId;
}

function safeRead(tripId: string): Expense[] {
  try {
    const raw = localStorage.getItem(key(tripId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function safeWrite(tripId: string, expenses: Expense[]): void {
  try { localStorage.setItem(key(tripId), JSON.stringify(expenses)); }
  catch { /* quota / privacy mode */ }
}

export function listExpenses(tripId: string): Expense[] {
  return safeRead(tripId).sort((a, b) => b.createdAt - a.createdAt);
}

export function addExpense(tripId: string, e: Omit<Expense, 'id' | 'createdAt'>): Expense {
  const expense: Expense = {
    ...e,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: Date.now(),
  };
  safeWrite(tripId, [expense, ...safeRead(tripId)]);
  return expense;
}

export function removeExpense(tripId: string, id: string): void {
  safeWrite(tripId, safeRead(tripId).filter((e) => e.id !== id));
}

export function totalSpent(expenses: Expense[]): number {
  return expenses.reduce((s, e) => s + (Number.isFinite(e.amount) ? e.amount : 0), 0);
}

export function spentByCategory(expenses: Expense[]): Map<ExpenseCategory, number> {
  const m = new Map<ExpenseCategory, number>();
  for (const e of expenses) {
    const amt = Number.isFinite(e.amount) ? e.amount : 0;
    m.set(e.category, (m.get(e.category) || 0) + amt);
  }
  return m;
}

export function spentByPayer(expenses: Expense[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of expenses) {
    const who = e.paidBy || 'Someone';
    const amt = Number.isFinite(e.amount) ? e.amount : 0;
    m.set(who, (m.get(who) || 0) + amt);
  }
  return m;
}

/**
 * Who owes whom, assuming an even split between `people`.
 * Greedy creditor/debtor matching → a minimal, readable list of transfers.
 */
export function settleUp(expenses: Expense[], people: string[]): { from: string; to: string; amount: number }[] {
  if (people.length < 2) return [];
  const total = totalSpent(expenses);
  if (total <= 0) return [];
  const share = total / people.length;
  const paid = spentByPayer(expenses);
  const balances = people.map((p) => ({ name: p, balance: (paid.get(p) || 0) - share }));

  const creditors = balances.filter((b) => b.balance > 0.005).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter((b) => b.balance < -0.005).sort((a, b) => a.balance - b.balance);

  const transfers: { from: string; to: string; amount: number }[] = [];
  let ci = 0, di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const credit = creditors[ci].balance;
    const debt = -debtors[di].balance;
    const amount = Math.min(credit, debt);
    if (amount > 0.005) {
      transfers.push({ from: debtors[di].name, to: creditors[ci].name, amount: Math.round(amount * 100) / 100 });
    }
    creditors[ci].balance -= amount;
    debtors[di].balance += amount;
    if (creditors[ci].balance <= 0.005) ci++;
    if (debtors[di].balance >= -0.005) di++;
  }
  return transfers;
}
