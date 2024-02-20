import { test } from 'vitest';
import type { ReportPageResponse } from '../../../../src/types/generated/expense-tracker';
import reportResponseForExtension from '../../../__data__/report_response_for_extension.json';
import { useExtendReportData } from '../../../../src/components/Content/Reports/useExtendReportData';
import { render } from '@testing-library/react';

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
						<div data-testid="categories">
							{report.categories.map((category) => (
								<p key={report.date}>
									{category.name}: {category.amountChange}
								</p>
							))}
						</div>
					</div>
				))}
		</div>
	);
};

test('extends report data', () => {
	render(<TestComponent data={data} />);
});
