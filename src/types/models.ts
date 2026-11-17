import type { Types } from "mongoose";

export interface UserRecord {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
}

export interface BankAccountRecord {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  accountType: string;
  lastDigits?: string;
  openingBalance: number;
}

export interface IncomeRecord {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  source: string;
  bankAccountId?: Types.ObjectId;
  category: string;
  description?: string;
  date: Date;
  paymentMethod?: string;
}

export interface ExpenseRecord {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  category: string;
  merchant: string;
  bankAccountId?: Types.ObjectId;
  description?: string;
  date: Date;
  paymentMethod?: string;
  receiptUrl?: string;
}

export interface BudgetRecord {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  amount: number;
  category?: string;
  month: number;
  year: number;
}

export interface CategoryRecord {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: "income" | "expense";
}

export interface SavingsGoalRecord {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  description?: string;
}

export type TransactionRecord = IncomeRecord | ExpenseRecord;
