import {
	NeedsAttentionResponse,
	SearchTransactionsRequest,
	SearchTransactionsResponse,
	TransactionAndCategory
} from '../../types/transactions';
import {
	UseMutateFunction,
	useMutation,
	useQuery,
	useQueryClient
} from 'react-query';
import {
	categorizeTransactions,
	getNeedsAttention,
	searchForTransactions
} from '../service/TransactionService';

export const SEARCH_FOR_TRANSACTIONS =
	'TransactionQueries_SearchForTransactions';
export const GET_NEEDS_ATTENTION = 'TransactionQueries_GetNeedsAttention';

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
			onSuccess: () =>
				Promise.all([
					queryClient.invalidateQueries(SEARCH_FOR_TRANSACTIONS),
					queryClient.invalidateQueries(GET_NEEDS_ATTENTION)
				])
		}
	);
};
