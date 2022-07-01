import {
	SearchTransactionsRequest,
	SearchTransactionsResponse
} from '../../types/transactions';
import { useQuery } from 'react-query';
import { searchForTransactions } from '../service/TransactionService';

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
