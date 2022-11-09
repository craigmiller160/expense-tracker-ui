import { EnhancedSearchTransactionsRequest } from '../../types/transactions';
import {
	CreateTransactionRequest,
	UpdateTransactionDetailsRequest,
	TransactionDuplicatePageResponse,
	TransactionToUpdate,
	NeedsAttentionResponse,
	TransactionAndCategory,
	TransactionResponse,
	TransactionsPageResponse,
	TransactionDetailsResponse
} from '../../types/generated/expense-tracker';
import {
	QueryClient,
	UseMutateFunction,
	useMutation,
	UseMutationResult,
	useQuery,
	useQueryClient,
	UseQueryResult
} from 'react-query';
import {
	categorizeTransactions,
	createTransaction,
	deleteTransactions,
	getNeedsAttention,
	getPossibleDuplicates,
	getTransactionDetails,
	markNotDuplicate,
	searchForTransactions,
	updateTransactionDetails,
	updateTransactions
} from '../service/TransactionService';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import * as Option from 'fp-ts/es6/Option';

export const SEARCH_FOR_TRANSACTIONS =
	'TransactionQueries_SearchForTransactions';
export const GET_NEEDS_ATTENTION = 'TransactionQueries_GetNeedsAttention';
export const GET_POSSIBLE_DUPLICATES =
	'TransactionQueries_GetPossibleDuplicates';
export const GET_TRANSACTION_DETAILS =
	'TransactionQueries_GetTransactionDetails';

const invalidateTransactionQueries = (queryClient: QueryClient) =>
	Promise.all([
		queryClient.invalidateQueries(SEARCH_FOR_TRANSACTIONS),
		queryClient.invalidateQueries(GET_NEEDS_ATTENTION),
		queryClient.invalidateQueries(GET_POSSIBLE_DUPLICATES),
		queryClient.invalidateQueries(GET_TRANSACTION_DETAILS)
	]);

type SearchForTransactionsKey = [string, EnhancedSearchTransactionsRequest];

export const useSearchForTransactions = (
	request: EnhancedSearchTransactionsRequest
): UseQueryResult<TransactionsPageResponse, Error> =>
	useQuery<
		TransactionsPageResponse,
		Error,
		TransactionsPageResponse,
		SearchForTransactionsKey
	>([SEARCH_FOR_TRANSACTIONS, request], ({ queryKey: [, req] }) =>
		searchForTransactions(req)
	);

type GetPossibleDuplicatesKey = [
	string,
	{ transactionId: string; pageNumber: number; pageSize: number }
];
export const useGetPossibleDuplicates = (
	transactionId: string,
	pageNumber: number,
	pageSize: number
) =>
	useQuery<
		TransactionDuplicatePageResponse,
		Error,
		TransactionDuplicatePageResponse,
		GetPossibleDuplicatesKey
	>(
		[
			GET_POSSIBLE_DUPLICATES,
			{
				transactionId,
				pageNumber,
				pageSize
			}
		],
		({ queryKey: [, { transactionId, pageNumber, pageSize }] }) =>
			getPossibleDuplicates(transactionId, pageNumber, pageSize)
	);

type GetTransactionDetailsKey = [string, OptionT<string>];
export const useGetTransactionDetails = (
	transactionId: OptionT<string>
): UseQueryResult<TransactionDetailsResponse, Error> =>
	useQuery<
		TransactionDetailsResponse,
		Error,
		TransactionDetailsResponse,
		GetTransactionDetailsKey
	>(
		[GET_TRANSACTION_DETAILS, transactionId],
		({ queryKey: [, id] }) =>
			// Will never execute orElse condition
			getTransactionDetails(Option.getOrElse(() => '')(id)),
		{ enabled: Option.isSome(transactionId) }
	);

export const useGetNeedsAttention = (): UseQueryResult<
	NeedsAttentionResponse,
	Error
> =>
	useQuery<NeedsAttentionResponse, Error>(GET_NEEDS_ATTENTION, () =>
		getNeedsAttention()
	);

interface CategorizeTransactionsParams {
	readonly transactionsAndCategories: ReadonlyArray<TransactionAndCategory>;
}

export const useCategorizeTransactions = (): UseMutationResult<
	unknown,
	Error,
	CategorizeTransactionsParams
> => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, CategorizeTransactionsParams>(
		({ transactionsAndCategories }) =>
			categorizeTransactions(transactionsAndCategories),
		{
			onSuccess: () => invalidateTransactionQueries(queryClient)
		}
	);
};

interface UpdateTransactionsParams {
	readonly transactions: ReadonlyArray<TransactionToUpdate>;
}

export type UpdateTransactionsMutation = UseMutateFunction<
	unknown,
	Error,
	UpdateTransactionsParams
>;

export const useUpdateTransactions = (): UseMutationResult<
	unknown,
	Error,
	UpdateTransactionsParams
> => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, UpdateTransactionsParams>(
		({ transactions }) => updateTransactions(transactions),
		{
			onSuccess: () => invalidateTransactionQueries(queryClient)
		}
	);
};

type MarkNotDuplicateParams = {
	readonly id: string;
};

export const useMarkNotDuplicate = (): UseMutationResult<
	unknown,
	Error,
	MarkNotDuplicateParams
> => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, MarkNotDuplicateParams>(
		({ id }) => markNotDuplicate(id),
		{
			onSuccess: () => invalidateTransactionQueries(queryClient)
		}
	);
};

type DeleteTransactionsParams = {
	readonly idsToDelete: ReadonlyArray<string>;
};

export const useDeleteTransactions = () => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, DeleteTransactionsParams>(
		({ idsToDelete }) => deleteTransactions(idsToDelete),
		{
			onSuccess: () => invalidateTransactionQueries(queryClient)
		}
	);
};

type UpdateTransactionDetailsParams = {
	readonly request: UpdateTransactionDetailsRequest;
};
export const useUpdateTransactionDetails = () => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, UpdateTransactionDetailsParams>(
		({ request }) => updateTransactionDetails(request),
		{
			onSuccess: () => invalidateTransactionQueries(queryClient)
		}
	);
};

type CreateTransactionParams = {
	readonly request: CreateTransactionRequest;
};
export const useCreateTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation<TransactionResponse, Error, CreateTransactionParams>(
		({ request }) => createTransaction(request),
		{
			onSuccess: () => invalidateTransactionQueries(queryClient)
		}
	);
};
