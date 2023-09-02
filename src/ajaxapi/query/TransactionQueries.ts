import { EnhancedSearchTransactionsRequest } from '../../types/transactions';
import {
	CreateTransactionRequest,
	DeleteTransactionsResponse,
	TransactionAndCategory,
	TransactionDetailsResponse,
	TransactionDuplicatePageResponse,
	TransactionResponse,
	TransactionsPageResponse,
	TransactionToUpdate,
	UpdateTransactionDetailsRequest
} from '../../types/generated/expense-tracker';
import {
	QueryClient,
	UseMutateFunction,
	useMutation,
	UseMutationResult,
	useQuery,
	useQueryClient,
	UseQueryResult
} from '@tanstack/react-query';
import {
	categorizeTransactions,
	createTransaction,
	deleteAllUnconfirmed,
	deleteTransactions,
	getPossibleDuplicates,
	getTransactionDetails,
	markNotDuplicate,
	searchForTransactions,
	updateTransactionDetails,
	updateTransactions
} from '../service/TransactionService';
import { OptionT } from '@craigmiller160/ts-functions/types';
import * as Option from 'fp-ts/Option';
import { GET_SPENDING_BY_MONTH_AND_CATEGORY } from './ReportQueries';
import { GET_NEEDS_ATTENTION } from './NeedsAttentionQueries';
import { debounceAsync } from '../../utils/debounceAsync';
import { QUERY_DEBOUNCE } from './constants';
import { alertManager } from '../../components/UI/Alerts/AlertManager';

export const SEARCH_FOR_TRANSACTIONS =
	'TransactionQueries_SearchForTransactions';
export const GET_POSSIBLE_DUPLICATES =
	'TransactionQueries_GetPossibleDuplicates';
export const GET_TRANSACTION_DETAILS =
	'TransactionQueries_GetTransactionDetails';

const invalidateTransactionQueries = (queryClient: QueryClient) =>
	Promise.all([
		queryClient.invalidateQueries({ queryKey: [SEARCH_FOR_TRANSACTIONS] }),
		queryClient.invalidateQueries({ queryKey: [GET_NEEDS_ATTENTION] }),
		queryClient.invalidateQueries({ queryKey: [GET_TRANSACTION_DETAILS] }),
		queryClient.invalidateQueries({
			queryKey: [GET_SPENDING_BY_MONTH_AND_CATEGORY]
		})
	]).then(() =>
		queryClient.invalidateQueries({ queryKey: [GET_POSSIBLE_DUPLICATES] })
	);

type SearchForTransactionsKey = [string, EnhancedSearchTransactionsRequest];
const debounceSearchForTransactions = debounceAsync(
	searchForTransactions,
	QUERY_DEBOUNCE
);
export const useSearchForTransactions = (
	request: EnhancedSearchTransactionsRequest
): UseQueryResult<TransactionsPageResponse, Error> =>
	useQuery<
		TransactionsPageResponse,
		Error,
		TransactionsPageResponse,
		SearchForTransactionsKey
	>({
		queryKey: [SEARCH_FOR_TRANSACTIONS, request],
		queryFn: ({ queryKey: [, req], signal }) =>
			debounceSearchForTransactions(req, signal),
		enabled: !!request.startDate && !!request.endDate
	});

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
	>({
		queryKey: [
			GET_POSSIBLE_DUPLICATES,
			{
				transactionId,
				pageNumber,
				pageSize
			}
		],
		queryFn: ({
			queryKey: [, { transactionId, pageNumber, pageSize }],
			signal
		}) => getPossibleDuplicates(transactionId, pageNumber, pageSize, signal)
	});

type GetTransactionDetailsKey = [string, OptionT<string>];
export const useGetTransactionDetails = (
	transactionId: OptionT<string>
): UseQueryResult<TransactionDetailsResponse, Error> =>
	useQuery<
		TransactionDetailsResponse,
		Error,
		TransactionDetailsResponse,
		GetTransactionDetailsKey
	>({
		queryKey: [GET_TRANSACTION_DETAILS, transactionId],
		queryFn: ({ queryKey: [, id], signal }) =>
			// Will never execute orElse condition
			getTransactionDetails(Option.getOrElse(() => '')(id), signal),
		enabled: Option.isSome(transactionId)
	});

interface CategorizeTransactionsParams {
	readonly transactionsAndCategories: ReadonlyArray<TransactionAndCategory>;
}

export const useCategorizeTransactions = (): UseMutationResult<
	unknown,
	Error,
	CategorizeTransactionsParams
> => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, CategorizeTransactionsParams>({
		mutationFn: ({ transactionsAndCategories }) =>
			categorizeTransactions(transactionsAndCategories),
		onSuccess: () => invalidateTransactionQueries(queryClient)
	});
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
	return useMutation<unknown, Error, UpdateTransactionsParams>({
		mutationFn: ({ transactions }) => updateTransactions(transactions),
		onSuccess: () => invalidateTransactionQueries(queryClient)
	});
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
	return useMutation<unknown, Error, MarkNotDuplicateParams>({
		mutationFn: ({ id }) => markNotDuplicate(id),
		onSuccess: () => invalidateTransactionQueries(queryClient)
	});
};

type DeleteTransactionsParams = {
	readonly idsToDelete: ReadonlyArray<string>;
};

export const useDeleteTransactions = () => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, DeleteTransactionsParams>({
		mutationFn: ({ idsToDelete }) => deleteTransactions(idsToDelete),
		onSuccess: () => invalidateTransactionQueries(queryClient)
	});
};

type UpdateTransactionDetailsParams = {
	readonly request: UpdateTransactionDetailsRequest;
};
export const useUpdateTransactionDetails = () => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, UpdateTransactionDetailsParams>({
		mutationFn: ({ request }) => updateTransactionDetails(request),
		onSuccess: () => invalidateTransactionQueries(queryClient)
	});
};

type CreateTransactionParams = {
	readonly request: CreateTransactionRequest;
};
export const useCreateTransaction = () => {
	const queryClient = useQueryClient();
	return useMutation<TransactionResponse, Error, CreateTransactionParams>({
		mutationFn: ({ request }) => createTransaction(request),
		onSuccess: () => invalidateTransactionQueries(queryClient)
	});
};

export const useDeleteAllUnconfirmed = () => {
	const queryClient = useQueryClient();
	return useMutation<DeleteTransactionsResponse, Error>({
		mutationFn: deleteAllUnconfirmed,
		onSuccess: (response) => {
			alertManager.addAlert(
				'success',
				`Successfully deleted ${response.transactionsDeleted} unconfirmed transactions`
			);
			return invalidateTransactionQueries(queryClient);
		}
	});
};
