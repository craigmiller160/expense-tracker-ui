// TODO move to library
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
	SelectOption,
	Rules
} from '@craigmiller160/react-hook-form-material-ui';
import { Controller } from 'react-hook-form';
import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select as MuiSelect
} from '@mui/material';

interface Props<F extends FieldValues> {
	readonly name: FieldPath<F>;
	readonly options: ReadonlyArray<SelectOption<string | number>>;
	readonly control: Control<F>;
	readonly rules?: Rules<F>;
	readonly label: string;
	readonly disabled?: boolean;
	readonly dynamicSubmit?: () => void;
}

export const Select = <F extends FieldValues>(props: Props<F>) => {
	return (
		<Controller
			name={props.name}
			control={props.control}
			rules={props.rules}
			render={({ field, fieldState }) => (
				<FormControl>
					<InputLabel>{props.label}</InputLabel>
					<MuiSelect
						{...field}
						onChange={(event) => {
							field.onChange(event);
							props.dynamicSubmit?.();
						}}
						label={props.label}
						error={!!fieldState.error}
						disabled={props.disabled}
					>
						{props.options.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</MuiSelect>
					<FormHelperText>{fieldState.error?.message}</FormHelperText>
				</FormControl>
			)}
		/>
	);
};
