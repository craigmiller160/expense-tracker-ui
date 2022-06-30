// TODO move this to component lib
import { Input } from '@mui/material';
import {
	Control,
	FieldPath,
	FieldValues,
	Controller,
	RegisterOptions
} from 'react-hook-form';
import styled from '@emotion/styled';

interface Props<F extends FieldValues> {
	readonly name: FieldPath<F>;
	readonly control: Control<F>;
	readonly rules?: Omit<
		RegisterOptions<F, FieldPath<F>>,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>;
}

const StyledDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;

	> * {
		width: 100%;
	}
`;

export const FileChooser = <F extends FieldValues>(props: Props<F>) => {
	return (
		<Controller
			name={props.name}
			control={props.control}
			rules={props.rules}
			render={({ field, fieldState }) => (
				<StyledDiv>
					<Input {...field} type="file" />
					<span style={{ color: 'red' }}>
						{fieldState.error?.message}
					</span>
				</StyledDiv>
			)}
		/>
	);
};
