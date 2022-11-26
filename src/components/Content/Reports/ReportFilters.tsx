import { UseFormReturn } from 'react-hook-form';
import { Paper } from '@mui/material';
import { constVoid } from 'fp-ts/es6/function';
import {
	Autocomplete,
	ValueHasChanged
} from '@craigmiller160/react-hook-form-material-ui';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';
import './ReportFilters.scss';
import { ReportFilterFormData } from './useGetReportData';
import { CategoryOption } from '../../../types/categories';

type Props = {
	readonly form: UseFormReturn<ReportFilterFormData>;
	readonly onValueHasChanged: ValueHasChanged;
	readonly categories?: ReadonlyArray<CategoryOption>;
};

export const ReportFilters = (props: Props) => {
	const {
		form: { control },
		categories
	} = props;
	return (
		<Paper className="ReportFilters">
			<form onSubmit={constVoid}>
				<ResponsiveRow>
					<Autocomplete
						multiple
						options={categories ?? []}
						control={control}
						name="excludedCategories"
						label="Excluded Categories"
						onValueHasChanged={props.onValueHasChanged}
					/>
				</ResponsiveRow>
			</form>
		</Paper>
	);
};