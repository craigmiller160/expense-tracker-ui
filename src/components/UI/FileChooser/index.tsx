// TODO move this to component lib
import { Input } from '@mui/material';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface Props<F extends FieldValues> {
	readonly name: FieldPath<F>;
	readonly control: Control<F>;
}

export const FileChooser = <F extends FieldValues>(props: Props<F>) => {

};
