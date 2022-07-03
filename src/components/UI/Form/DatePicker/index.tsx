// TODO move to lib
import { Control, FieldPath, FieldValues, Controller } from 'react-hook-form';
import { Rules } from '@craigmiller160/react-hook-form-material-ui';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import MuiTextField from '@mui/material/TextField';

interface Props<F extends FieldValues> {
	readonly name: FieldPath<F>;
	readonly control: Control<F>;
	readonly label: string;
	readonly rules?: Rules<F>;
	readonly disabled?: boolean;
}

export const DatePicker = <F extends FieldValues>(props: Props<F>) => (
	<Controller
		name={props.name}
		control={props.control}
		render={({ field }) => (
			<MuiDatePicker
				{...field}
				label={props.label}
				disabled={props.disabled}
				renderInput={(params) => <MuiTextField {...params} />}
			/>
		)}
	/>
);
