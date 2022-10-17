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

export interface EitherThrowableUnit {
  empty: boolean;
  right$arrow_core: boolean;
  left$arrow_core: boolean;
  notEmpty: boolean;
  right: boolean;
  left: boolean;
}

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

export interface EitherThrowableImportTransactionsResponse {
  empty: boolean;
  right$arrow_core: boolean;
  left$arrow_core: boolean;
  notEmpty: boolean;
  right: boolean;
  left: boolean;
}

export interface AuthCodeLoginDto {
  url: string;
}

export interface EitherThrowableCategoryResponse {
  empty: boolean;
  right$arrow_core: boolean;
  left$arrow_core: boolean;
  notEmpty: boolean;
  right: boolean;
  left: boolean;
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

export interface EitherThrowableTransactionDuplicatePageResponse {
  empty: boolean;
  right$arrow_core: boolean;
  left$arrow_core: boolean;
  notEmpty: boolean;
  right: boolean;
  left: boolean;
}

export interface EitherThrowableNeedsAttentionResponse {
  empty: boolean;
  right$arrow_core: boolean;
  left$arrow_core: boolean;
  notEmpty: boolean;
  right: boolean;
  left: boolean;
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

export interface EitherThrowableListCategoryResponse {
  empty: boolean;
  right$arrow_core: boolean;
  left$arrow_core: boolean;
  notEmpty: boolean;
  right: boolean;
  left: boolean;
}

export interface DeleteTransactionsRequest {
  ids: string[];
}

export type Unit = object;
