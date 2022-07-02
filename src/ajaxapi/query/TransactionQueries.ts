import {
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
	searchForTransactions
} from '../service/TransactionService';

export const SEARCH_FOR_TRANSACTIONS =
	'TransactionQueries_SearchForTransactions';

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
				// TODO make sure this works with just the string key
				queryClient.invalidateQueries(SEARCH_FOR_TRANSACTIONS)
		}
	);
};
