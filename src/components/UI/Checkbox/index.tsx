// TODO move to lib
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { FormControlLabel } from '@mui/material';
import MuiCheckbox from '@mui/material/Checkbox';

interface Props<F extends FieldValues> {
	readonly control: Control<F>;
	readonly name: FieldPath<F>;
	readonly label: string;
}

export const Checkbox = <F extends FieldValues>(props: Props<F>) => (
	<Controller
		name={props.name}
		control={props.control}
		render={({ field }) => (
			<FormControlLabel
				label={props.label}
				control={<MuiCheckbox {...field} />}
			/>
		)}
	/>
);
