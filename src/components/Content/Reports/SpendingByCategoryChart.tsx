import { ReportCategoryResponse } from '../../../types/generated/expense-tracker';
import { PieChart } from '@mui/icons-material';
import { Cell, Pie } from 'recharts';
import { castDraft } from 'immer';

type Props = {
	readonly categories: ReadonlyArray<ReportCategoryResponse>;
};

const getLabel = (category: ReportCategoryResponse): string => category.name;

export const SpendingByCategoryChart = (props: Props) => (
	<PieChart width={500} height={500}>
		<Pie
			data={castDraft(props.categories)}
			dataKey="amount"
			nameKey="name"
			label={getLabel}
		>
			{props.categories.map((category) => (
				<Cell key={category.name} fill={category.color} />
			))}
		</Pie>
	</PieChart>
);
