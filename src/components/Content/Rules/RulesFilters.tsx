import { Paper } from '@mui/material';
import {
	Autocomplete,
	TextField, ValueHasChanged
} from '@craigmiller160/react-hook-form-material-ui';
import { UseFormReturn } from 'react-hook-form';
import { RulesFiltersFormData } from './useHandleAllRulesData';
import { CategoryOption } from '../Transactions/utils';
import './RulesFilters.scss';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';

type Props = {
	readonly form: UseFormReturn<RulesFiltersFormData>;
	readonly categories: ReadonlyArray<CategoryOption>;
	readonly onValueHasChanged: ValueHasChanged;
};

export const RulesFilters = (props: Props) => {
	return (
		<Paper className="AutoCategorizeRulesFilters">
			<form>
				<ResponsiveRow>
					<TextField
						control={props.form.control}
						name="regex"
						label="Regex"
						onValueHasChanged={props.onValueHasChanged}
					/>
					<Autocomplete
						options={props.categories}
						control={props.form.control}
						name="category"
						label="Category"
						onValueHasChanged={props.onValueHasChanged}
					/>
				</ResponsiveRow>
			</form>
		</Paper>
	);
};
