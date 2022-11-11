import { ReportCategoryResponse } from '../../../types/generated/expense-tracker';
import { Cell, Pie, PieChart } from 'recharts';
import { castDraft } from 'immer';
import './SpendingByCategoryChart.scss';

type Props = {
	readonly categories: ReadonlyArray<ReportCategoryResponse>;
};

const getLabel = (category: ReportCategoryResponse): string => category.name;

// TODO how to make the width/height properly responsive? may need some ugly code here because recharts is weird with it
export const SpendingByCategoryChart = (props: Props) => (
	<div className="SpendingByCategoryChart">
		<PieChart width={500} height={300}>
			<Pie
				data={castDraft(props.categories)}
				dataKey="percent"
				nameKey="name"
				label={getLabel}
			>
				{props.categories.map((category) => (
					<Cell key={category.name} fill={category.color} />
				))}
			</Pie>
		</PieChart>
	</div>
);
