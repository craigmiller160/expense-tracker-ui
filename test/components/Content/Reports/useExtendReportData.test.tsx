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
						<p>Total Change: {report.totalChange ?? 'N/A'}</p>
						{report.categories.map((category) => (
							<p key={category.name} data-testid="category">
								{category.name}:{' '}
								{category.amountChange ?? 'N/A'}
							</p>
						))}
					</div>
				))}
		</div>
	);
};

type ExpectedResults = Readonly<{
	date: string;
	totalChange: string;
	categories: ReadonlyArray<
		Readonly<{
			name: string;
			amountChange: string;
		}>
	>;
}>;

test.each<ExpectedResults>([
	{
		date: '2024-01-01',
		totalChange: '15',
		categories: [
			{ name: 'One', amountChange: '2' },
			{ name: 'Two', amountChange: '-15' },
			{ name: 'Three', amountChange: '4' }
		]
	},
	{
		date: '2023-12-01',
		totalChange: '-15',
		categories: [
			{ name: 'One', amountChange: '-2' },
			{ name: 'Five', amountChange: '-30' },
			{ name: 'Three', amountChange: '-4' }
		]
	},
	{
		date: '2023-11-01',
		totalChange: 'N/A',
		categories: [
			{ name: 'One', amountChange: 'N/A' },
			{ name: 'Two', amountChange: 'N/A' },
			{ name: 'Three', amountChange: 'N/A' }
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
