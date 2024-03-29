import { Button, Paper } from '@mui/material';
import type { ValueHasChanged } from '@craigmiller160/react-hook-form-material-ui';
import {
	Autocomplete,
	TextField
} from '@craigmiller160/react-hook-form-material-ui';
import type { UseFormReturn } from 'react-hook-form';
import type { RulesFiltersFormData } from './useHandleAllRulesData';
import { defaultRulesFiltersFormData } from './useHandleAllRulesData';
import './RulesFilters.scss';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';
import { constVoid } from 'fp-ts/function';
import type { CategoryOption } from '../../../types/categories';

type Props = {
	readonly form: UseFormReturn<RulesFiltersFormData>;
	readonly categories: ReadonlyArray<CategoryOption>;
	readonly onValueHasChanged: ValueHasChanged;
};

export const RulesFilters = (props: Props) => {
	const resetFilters = () => {
		props.form.reset(defaultRulesFiltersFormData);
		props.onValueHasChanged();
	};
	return (
		<Paper className="auto-categorize-rules-filters">
			<form onSubmit={constVoid}>
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
				<ResponsiveRow>
					<Button
						id="rulesFilterResetButton"
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
