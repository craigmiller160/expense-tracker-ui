import { Paper, Typography } from '@mui/material';
import './NeedsAttentionNotice.scss';
import { useGetNeedsAttention } from '../../../ajaxapi/query/NeedsAttentionQueries';
import {
	CountAndOldest,
	NeedsAttentionResponse
} from '../../../types/generated/expense-tracker';
import { pipe } from 'fp-ts/function';
import {
	formatDisplayDate,
	parseServerDate
} from '../../../utils/dateTimeUtils';

const doItemsNeedAttention = (data?: NeedsAttentionResponse): boolean =>
	(data?.unconfirmed?.count ?? 0) > 0 ||
	(data?.uncategorized?.count ?? 0) > 0 ||
	(data?.duplicate?.count ?? 0) > 0 ||
	(data?.possibleRefund?.count ?? 0) > 0;

interface AttentionItemProps {
	readonly countAndOldest: CountAndOldest;
	readonly label: string;
}

const formatDate = (date?: string): string => {
	if (!date) {
		return '';
	}
	return pipe(parseServerDate(date), formatDisplayDate);
};

const AttentionItem = (props: AttentionItemProps) => {
	if (props.countAndOldest.count === 0) {
		return <></>;
	}

	const classNameLabel = props.label.replace(/\s/g, '_');

	return (
		<li className={`AttentionItem-${classNameLabel}`}>
			<Typography variant="body1">
				{props.label} - Count: {props.countAndOldest.count}, Oldest:{' '}
				{formatDate(props.countAndOldest.oldest)}
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
		<Paper
			className="needs-attention-notice"
			data-testid="needs-attention-notice"
		>
			<div className="header">
				<Typography variant="h6">
					Transactions Need Attention
				</Typography>
			</div>
			<ul className="items">
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
				<AttentionItem
					countAndOldest={data.possibleRefund}
					label="Possible Refunds"
				/>
			</ul>
		</Paper>
	);
};
