import { Paper, Typography } from '@mui/material';
import './NeedsAttentionNotice.scss';
import { useGetNeedsAttention } from '../../../ajaxapi/query/TransactionQueries';
import {
	CountAndOldest,
	DATE_FORMAT,
	NeedsAttentionResponse
} from '../../../types/transactions';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';

const parseResponseDate = Time.parse(DATE_FORMAT);
const formatDisplayDate = Time.format('MM/dd/yyyy');

const doItemsNeedAttention = (data?: NeedsAttentionResponse): boolean =>
	(data?.unconfirmed?.count ?? 0) > 0 ||
	(data?.uncategorized?.count ?? 0) > 0 ||
	(data?.duplicate?.count ?? 0) > 0;

interface AttentionItemProps {
	readonly countAndOldest: CountAndOldest;
	readonly label: string;
}

const formatDate = (date: string | null): string => {
	if (date === null) {
		return '';
	}
	return pipe(parseResponseDate(date), formatDisplayDate);
};

const AttentionItem = (props: AttentionItemProps) => {
	if (props.countAndOldest.count === 0) {
		return <></>;
	}

	return (
		<li>
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
			className="NeedsAttentionNotice"
			data-testid="needs-attention-notice"
		>
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
