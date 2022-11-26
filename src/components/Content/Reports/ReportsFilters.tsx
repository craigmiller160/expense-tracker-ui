import { UseFormReturn } from 'react-hook-form';
import { CategoryOption } from '../../../types/categories';
import { Paper } from '@mui/material';
import { constVoid } from 'fp-ts/es6/function';
import {ValueHasChanged} from '@craigmiller160/react-hook-form-material-ui';

export type ReportFilterFormData = {
	readonly excludedCategories: ReadonlyArray<CategoryOption>;
};

type Props = {
	readonly form: UseFormReturn<ReportFilterFormData>;
	readonly onValueHasChanged: ValueHasChanged;
};

export const ReportsFilters = (props: Props) => {
	return (
		<Paper className="ReportsFilters">
			<form onSubmit={constVoid}>
				<div />
			</form>
		</Paper>
	);
};
