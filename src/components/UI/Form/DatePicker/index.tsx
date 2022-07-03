// TODO move to lib
import { Control, FieldPath, FieldValues, Controller } from 'react-hook-form';
import { Rules } from '@craigmiller160/react-hook-form-material-ui';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import MuiTextField from '@mui/material/TextField';

interface Props<F extends FieldValues> {
	readonly name: FieldPath<F>;
	readonly control: Control<F>;
	readonly label: string;
	readonly rules?: Rules<F>;
}

// TODO try dynamically picking desktop vs mobile
export const DatePicker = <F extends FieldValues>(props: Props<F>) => (
	<Controller
		name={props.name}
		control={props.control}
		render={({ field }) => (
			<DesktopDatePicker
				{...field}
				renderInput={(params) => <MuiTextField {...params} />}
			/>
		)}
	/>
);
