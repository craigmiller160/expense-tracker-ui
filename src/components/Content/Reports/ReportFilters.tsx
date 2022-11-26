import { UseFormReturn } from 'react-hook-form';
import { Paper } from '@mui/material';
import { constVoid } from 'fp-ts/es6/function';
import { ValueHasChanged } from '@craigmiller160/react-hook-form-material-ui';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';
import './ReportFilters.scss';
import { ReportFilterFormData } from './useGetReportData';

type Props = {
	readonly form: UseFormReturn<ReportFilterFormData>;
	readonly onValueHasChanged: ValueHasChanged;
};

export const ReportFilters = (props: Props) => {
	return (
		<Paper className="ReportFilters">
			<form onSubmit={constVoid}>
				<ResponsiveRow></ResponsiveRow>
			</form>
		</Paper>
	);
};
