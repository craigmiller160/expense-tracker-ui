import { Paper, Typography } from '@mui/material';
import './NeedsAttentionNotice.scss';
import { useGetNeedsAttention } from '../../../ajaxapi/query/TransactionQueries';
import { NeedsAttentionResponse } from '../../../types/transactions';

const doItemsNeedAttention = (data?: NeedsAttentionResponse): boolean =>
	(data?.unconfirmed?.count ?? 0) > 0 ||
	(data?.uncategorized?.count ?? 0) > 0 ||
	(data?.duplicate?.count ?? 0) > 0;

export const NeedsAttentionNotice = () => {
	const { data, status } = useGetNeedsAttention();
	if (status !== 'success' || !doItemsNeedAttention(data)) {
		return <></>;
	}

	return (
		<Paper className="NeedsAttentionNotice">
			<div className="Header">
				<Typography variant="h6">
					Transactions Need Attention
				</Typography>
			</div>
		</Paper>
	);
};
