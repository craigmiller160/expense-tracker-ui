// TODO move to lib
import { Control, FieldPath, FieldValues, Controller } from 'react-hook-form';
import { Rules } from '@craigmiller160/react-hook-form-material-ui';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import MuiTextField from '@mui/material/TextField';
import isValid from 'date-fns/isValid/index';

interface Props<F extends FieldValues> {
	readonly name: FieldPath<F>;
	readonly control: Control<F>;
	readonly label: string;
	readonly rules?: Rules<F>;
	readonly disabled?: boolean;
	readonly dynamicSubmit?: () => void;
}

const validate = (value: Date): string | undefined =>
	isValid(value) ? undefined : 'Must be valid date';

export const DatePicker = <F extends FieldValues>(props: Props<F>) => {
	const rules: Rules<F> = {
		...(props.rules ?? {}),
		validate
	};
	return (
		<Controller
			name={props.name}
			control={props.control}
			rules={rules}
			render={({ field, fieldState }) => (
				<MuiDatePicker
					{...field}
					onChange={(date, stringValue) => {
						field.onChange(date, stringValue);
						if (stringValue === undefined) {
							props.dynamicSubmit?.();
						}
					}}
					label={props.label}
					disabled={props.disabled}
					renderInput={(params) => (
						<MuiTextField
							{...params}
							onBlur={(event) => {
								params?.onBlur?.(event);
								props.dynamicSubmit?.();
							}}
							error={!!fieldState.error}
							helperText={fieldState.error?.message ?? ''}
						/>
					)}
				/>
			)}
		/>
	);
};
