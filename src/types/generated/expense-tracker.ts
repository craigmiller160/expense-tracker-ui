/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface TransactionToUpdate {
  /** @format uuid */
  transactionId: string;
  confirmed: boolean;
  /** @format uuid */
  categoryId?: string;
}

export interface UpdateTransactionsRequest {
  transactions: TransactionToUpdate[];
}

export type Unit = object;

export interface UpdateTransactionDetailsRequest {
  /** @format uuid */
  transactionId: string;
  confirmed: boolean;
  /** @format date */
  expenseDate: string;
  description: string;
  amount: number;
  /** @format uuid */
  categoryId?: string;
}

export interface ConfirmTransactionsRequest {
  transactionsToConfirm: TransactionToConfirm[];
}

export interface TransactionToConfirm {
  /** @format uuid */
  transactionId: string;
  confirmed: boolean;
}

export interface CategorizeTransactionsRequest {
  transactionsAndCategories: TransactionAndCategory[];
}

export interface TransactionAndCategory {
  /** @format uuid */
  transactionId: string;
  /** @format uuid */
  categoryId?: string;
}

export interface CategoryRequest {
  name: string;
}

export interface CreateTransactionRequest {
  /** @format date */
  expenseDate: string;
  description: string;
  amount: number;
  /** @format uuid */
  categoryId?: string;
}

export interface TransactionResponse {
  /** @format uuid */
  id: string;
  /** @format date */
  expenseDate: string;
  description: string;
  amount: number;
  confirmed: boolean;
  duplicate: boolean;
  /** @format uuid */
  categoryId?: string;
  categoryName?: string;
}

export interface ImportTransactionsResponse {
  /** @format int32 */
  transactionsImported: number;
}

export interface AuthCodeLoginDto {
  url: string;
}

export interface CategoryResponse {
  /** @format uuid */
  id: string;
  name: string;
}

export interface SearchTransactionsRequest {
  /** @format int32 */
  pageNumber: number;
  /** @format int32 */
  pageSize: number;
  sortKey: "EXPENSE_DATE";
  sortDirection: "ASC" | "DESC";
  /** @format date */
  startDate?: string;
  /** @format date */
  endDate?: string;
  isConfirmed?: boolean;
  isCategorized?: boolean;
  isDuplicate?: boolean;
  isPossibleRefund?: boolean;
  categoryIds?: string[];
}

export interface TransactionsPageResponse {
  transactions: TransactionResponse[];
  /** @format int32 */
  pageNumber: number;
  /** @format int64 */
  totalItems: number;
}

export interface GetPossibleDuplicatesRequest {
  /** @format int32 */
  pageNumber: number;
  /** @format int32 */
  pageSize: number;
}

export interface TransactionDuplicatePageResponse {
  transactions: TransactionDuplicateResponse[];
  /** @format int32 */
  pageNumber: number;
  /** @format int64 */
  totalItems: number;
}

export interface TransactionDuplicateResponse {
  /** @format uuid */
  id: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  updated: string;
  categoryName?: string;
}

export interface CountAndOldest {
  /** @format int64 */
  count: number;
  /** @format date */
  oldest?: string;
}

export interface NeedsAttentionResponse {
  unconfirmed: CountAndOldest;
  uncategorized: CountAndOldest;
  duplicate: CountAndOldest;
  possibleRefund: CountAndOldest;
}

export interface ImportTypeResponse {
  key: string;
  displayName: string;
}

export interface AuthUserDto {
  /** @format int64 */
  userId: number;
  username: string;
  roles: string[];
  firstName: string;
  lastName: string;
}

export interface DeleteTransactionsRequest {
  ids: string[];
}
