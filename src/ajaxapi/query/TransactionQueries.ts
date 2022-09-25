import {
	NeedsAttentionResponse,
	SearchTransactionsRequest,
	SearchTransactionsResponse,
	TransactionAndCategory,
	TransactionToUpdate
} from '../../types/transactions';
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
	deleteTransactions,
	getNeedsAttention,
	searchForTransactions,
	updateTransactions
} from '../service/TransactionService';

export const SEARCH_FOR_TRANSACTIONS =
	'TransactionQueries_SearchForTransactions';
export const GET_NEEDS_ATTENTION = 'TransactionQueries_GetNeedsAttention';

const invalidateTransactionQueries = (queryClient: QueryClient) =>
	Promise.all([
		queryClient.invalidateQueries(SEARCH_FOR_TRANSACTIONS),
		queryClient.invalidateQueries(GET_NEEDS_ATTENTION)
	]);

type SearchForTransactionsKey = [string, SearchTransactionsRequest];

export const useSearchForTransactions = (
	request: SearchTransactionsRequest
): UseQueryResult<SearchTransactionsResponse, Error> =>
	useQuery<
		SearchTransactionsResponse,
		Error,
		SearchTransactionsResponse,
		SearchForTransactionsKey
	>([SEARCH_FOR_TRANSACTIONS, request], ({ queryKey: [, req] }) =>
		searchForTransactions(req)
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

type DeleteTransactionsParams = {
	idsToDelete: ReadonlyArray<string>;
};

export const useDeleteTransactions = () => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, DeleteTransactionsParams>(
		({ idsToDelete }) => deleteTransactions(idsToDelete),
		{
			onSuccess: () => invalidateTransactionQueries(queryClient)
		}
	);
};
