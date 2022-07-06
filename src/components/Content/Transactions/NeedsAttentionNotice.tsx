import { Paper, Typography } from '@mui/material';
import './NeedsAttentionNotice.scss';
import { useGetNeedsAttention } from '../../../ajaxapi/query/TransactionQueries';
import {
	CountAndOldest,
	NeedsAttentionResponse
} from '../../../types/transactions';

const doItemsNeedAttention = (data?: NeedsAttentionResponse): boolean =>
	(data?.unconfirmed?.count ?? 0) > 0 ||
	(data?.uncategorized?.count ?? 0) > 0 ||
	(data?.duplicate?.count ?? 0) > 0;

interface AttentionItemProps {
	readonly countAndOldest: CountAndOldest;
	readonly label: string;
}

// TODO format the date
const AttentionItem = (props: AttentionItemProps) => {
	if (props.countAndOldest.count === 0) {
		return <></>;
	}

	return (
		<li>
			<Typography variant="body1">
				{props.label} - Count: {props.countAndOldest.count}, Oldest:{' '}
				{props.countAndOldest.oldest}
			</Typography>
		</li>
	);
};

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
			<ul className="Items">
				<AttentionItem
					countAndOldest={data.duplicate}
					label="Duplicates"
				/>
				<AttentionItem
					countAndOldest={data.unconfirmed}
					label="Unconfirmed"
				/>
				<AttentionItem
					countAndOldest={data.uncategorized}
					label="Uncategorized"
				/>
			</ul>
		</Paper>
	);
};
