import { UseFormReturn } from 'react-hook-form';
import { Button, Paper } from '@mui/material';
import { constVoid } from 'fp-ts/es6/function';
import {
	Autocomplete,
	Select,
	ValueHasChanged
} from '@craigmiller160/react-hook-form-material-ui';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';
import './ReportFilters.scss';
import {
	defaultReportFilterFormData,
	ReportFilterFormData
} from './useGetReportData';
import { CategoryOption } from '../../../types/categories';
import {
	REPORT_CATEGORY_FILTER_OPTIONS,
	REPORT_CATEGORY_ORDER_BY_OPTIONS
} from '../../../types/reports';

type Props = {
	readonly form: UseFormReturn<ReportFilterFormData>;
	readonly onValueHasChanged: ValueHasChanged;
	readonly categories?: ReadonlyArray<CategoryOption>;
};

export const ReportFilters = (props: Props) => {
	const {
		form: { control, reset },
		categories
	} = props;

	const resetFilters = () => reset(defaultReportFilterFormData);

	return (
		<Paper className="ReportFilters">
			<form onSubmit={constVoid}>
				<ResponsiveRow>
					<Autocomplete
						options={REPORT_CATEGORY_FILTER_OPTIONS}
						control={control}
						name="categoryFilterType"
						label="Filter Type"
						onValueHasChanged={props.onValueHasChanged}
					/>
					<Autocomplete
						multiple
						options={categories ?? []}
						control={control}
						name="categories"
						label="Categories"
						onValueHasChanged={props.onValueHasChanged}
					/>
					<Select
						id="reportOrderCategoriesBy"
						options={REPORT_CATEGORY_ORDER_BY_OPTIONS}
						control={control}
						name="orderCategoriesBy"
						label="Order Categories By"
					/>
				</ResponsiveRow>
				<ResponsiveRow>
					<Button
						id="reportFilterResetButton"
						variant="contained"
						color="info"
						onClick={resetFilters}
					>
						Reset
					</Button>
				</ResponsiveRow>
			</form>
		</Paper>
	);
};
