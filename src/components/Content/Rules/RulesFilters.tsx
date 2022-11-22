import { Paper } from '@mui/material';
import {
	Autocomplete,
	TextField
} from '@craigmiller160/react-hook-form-material-ui';
import { UseFormReturn } from 'react-hook-form';
import { RulesFiltersFormData } from './useGetAllRulesData';
import { CategoryOption } from '../Transactions/utils';
import './RulesFilters.scss';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';

type Props = {
	readonly form: UseFormReturn<RulesFiltersFormData>;
	readonly categories: ReadonlyArray<CategoryOption>;
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
					/>
					<Autocomplete
						options={props.categories}
						control={props.form.control}
						name="category"
						label="Category"
					/>
				</ResponsiveRow>
			</form>
		</Paper>
	);
};
