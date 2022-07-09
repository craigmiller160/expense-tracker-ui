import {
	NeedsAttentionResponse,
	SearchTransactionsRequest,
	SearchTransactionsResponse,
	TransactionAndCategory
} from '../../types/transactions';
import {
	QueryClient,
	UseMutateFunction,
	useMutation,
	useQuery,
	useQueryClient
} from 'react-query';
import {
	categorizeTransactions,
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

export const useSearchForTransactions = (request: SearchTransactionsRequest) =>
	useQuery<
		SearchTransactionsResponse,
		Error,
		SearchTransactionsResponse,
		SearchForTransactionsKey
	>([SEARCH_FOR_TRANSACTIONS, request], ({ queryKey: [, req] }) =>
		searchForTransactions(req)
	);

export const useGetNeedsAttention = () =>
	useQuery<NeedsAttentionResponse, Error>(GET_NEEDS_ATTENTION, () =>
		getNeedsAttention()
	);

interface CategorizeTransactionsParams {
	readonly transactionsAndCategories: ReadonlyArray<TransactionAndCategory>;
}

export type CategorizeTransactionsMutation = UseMutateFunction<
	unknown,
	Error,
	CategorizeTransactionsParams
>;

export const useCategorizeTransactions = () => {
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
	readonly categorize: ReadonlyArray<TransactionAndCategory>;
	readonly confirm: ReadonlyArray<string>;
}

export type UpdateTransactionsMutation = UseMutateFunction<
	unknown,
	Error,
	UpdateTransactionsParams
>;

export const useUpdateTransactions = () => {
	const queryClient = useQueryClient();
	useMutation<unknown, Error, UpdateTransactionsParams>(
		({ categorize, confirm }) => updateTransactions(categorize, confirm),
		{
			onSuccess: () => invalidateTransactionQueries(queryClient)
		}
	);
};
