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

export interface AuthCodeLoginDto {
  url: string;
}

export interface AuthUserDto {
  firstName: string;
  lastName: string;
  roles: string[];
  /** @format int64 */
  userId: number;
  username: string;
}

export interface CategorizeTransactionsRequest {
  transactionsAndCategories: TransactionAndCategory[];
}

export interface CategoryRequest {
  name: string;
}

export interface CategoryResponse {
  /** @format uuid */
  id: string;
  name: string;
}

export interface ConfirmTransactionsRequest {
  transactionsToConfirm: TransactionToConfirm[];
}

export interface CountAndOldest {
  /** @format int64 */
  count: number;
  /** @format date */
  oldest?: string;
}

export interface CreateTransactionRequest {
  amount: number;
  /** @format uuid */
  categoryId?: string;
  description: string;
  /** @format date */
  expenseDate: string;
}

export interface DeleteTransactionsRequest {
  ids: string[];
}

export interface GetPossibleDuplicatesRequest {
  /** @format int32 */
  pageNumber: number;
  /** @format int32 */
  pageSize: number;
}

export interface ImportTransactionsResponse {
  /** @format int32 */
  transactionsImported: number;
}

export interface ImportTypeResponse {
  displayName: string;
  key: string;
}

export interface NeedsAttentionResponse {
  duplicate: CountAndOldest;
  possibleRefund: CountAndOldest;
  uncategorized: CountAndOldest;
  unconfirmed: CountAndOldest;
}

export interface SearchTransactionsRequest {
  categoryIds?: string[];
  /** @format date */
  endDate?: string;
  isCategorized?: boolean;
  isConfirmed?: boolean;
  isDuplicate?: boolean;
  isPossibleRefund?: boolean;
  /** @format int32 */
  pageNumber: number;
  /** @format int32 */
  pageSize: number;
  sortDirection: "ASC" | "DESC";
  sortKey: "EXPENSE_DATE";
  /** @format date */
  startDate?: string;
}

export interface TransactionAndCategory {
  /** @format uuid */
  categoryId?: string;
  /** @format uuid */
  transactionId: string;
}

export interface TransactionDuplicatePageResponse {
  /** @format int32 */
  pageNumber: number;
  /** @format int64 */
  totalItems: number;
  transactions: TransactionDuplicateResponse[];
}

export interface TransactionDuplicateResponse {
  categoryName?: string;
  /** @format date-time */
  created: string;
  /** @format uuid */
  id: string;
  /** @format date-time */
  updated: string;
}

export interface TransactionResponse {
  amount: number;
  /** @format uuid */
  categoryId?: string;
  categoryName?: string;
  confirmed: boolean;
  description: string;
  duplicate: boolean;
  /** @format date */
  expenseDate: string;
  /** @format uuid */
  id: string;
}

export interface TransactionToConfirm {
  confirmed: boolean;
  /** @format uuid */
  transactionId: string;
}

export interface TransactionToUpdate {
  /** @format uuid */
  categoryId?: string;
  confirmed: boolean;
  /** @format uuid */
  transactionId: string;
}

export interface TransactionsPageResponse {
  /** @format int32 */
  pageNumber: number;
  /** @format int64 */
  totalItems: number;
  transactions: TransactionResponse[];
}

export type Unit = object;

export interface UpdateTransactionDetailsRequest {
  amount: number;
  /** @format uuid */
  categoryId?: string;
  confirmed: boolean;
  description: string;
  /** @format date */
  expenseDate: string;
  /** @format uuid */
  transactionId: string;
}

export interface UpdateTransactionsRequest {
  transactions: TransactionToUpdate[];
}
