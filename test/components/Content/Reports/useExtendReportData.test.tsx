import { test, expect } from 'vitest';
import type { ReportPageResponse } from '../../../../src/types/generated/expense-tracker';
import reportResponseForExtension from '../../../__data__/report_response_for_extension.json';
import { useExtendReportData } from '../../../../src/components/Content/Reports/useExtendReportData';
import { render, screen, within } from '@testing-library/react';

const data: ReportPageResponse = reportResponseForExtension;

type Props = Readonly<{
	data: ReportPageResponse;
}>;

const TestComponent = (props: Props) => {
	const extendedData = useExtendReportData(props.data);
	return (
		<div>
			<h1>Extended Data</h1>
			{extendedData &&
				extendedData.reports.map((report) => (
					<div
						data-testid={`report-${report.date}`}
						key={report.date}
					>
						<p>Total Change: {report.totalChange}</p>
						{report.categories.map((category) => (
							<p key={category.name} data-testid="category">
								{category.name}: {category.amountChange}
							</p>
						))}
					</div>
				))}
		</div>
	);
};

type ExpectedResults = Readonly<{
	date: string;
	totalChange: number;
	categories: ReadonlyArray<
		Readonly<{
			name: string;
			amountChange: number;
		}>
	>;
}>;

test.each<ExpectedResults>([
	{
		date: '2024-01-01',
		totalChange: 15,
		categories: [
			{ name: 'One', amountChange: 2 },
			{ name: 'Two', amountChange: -15 },
			{ name: 'Three', amountChange: 4 }
		]
	}
])('extends report data for $date', ({ date, totalChange, categories }) => {
	render(<TestComponent data={data} />);
	const root = screen.getByTestId(`report-${date}`);
	expect(within(root).getByText(/Total Change/)).toHaveTextContent(
		`Total Change: ${totalChange}`
	);

	const categoryElements = within(root).getAllByTestId('category');
	expect(categoryElements).toHaveLength(categories.length);

	categories.forEach((category, index) => {
		const categoryElement = categoryElements[index];
		expect(categoryElement).toHaveTextContent(
			`${category.name}: ${category.amountChange}`
		);
	});
});
