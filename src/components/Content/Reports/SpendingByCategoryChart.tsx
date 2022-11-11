import { ReportCategoryResponse } from '../../../types/generated/expense-tracker';
import { Cell, Pie, PieChart } from 'recharts';
import { castDraft } from 'immer';
import './SpendingByCategoryChart.scss';

type Props = {
	readonly categories: ReadonlyArray<ReportCategoryResponse>;
};

const getLabel = (category: ReportCategoryResponse): string => category.name;

export const SpendingByCategoryChart = (props: Props) => (
	<div className="SpendingByCategoryChart">
		<PieChart width={200} height={200}>
			<Pie
				data={castDraft(props.categories)}
				dataKey="amount"
				nameKey="name"
				label={getLabel}
				fill="#8884d8"
			>
				{props.categories.map((category) => (
					<Cell key={category.name} fill={category.color} />
				))}
			</Pie>
		</PieChart>
	</div>
);
