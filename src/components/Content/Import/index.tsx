import './ImportTransactions.scss';
import { Button, Input, Typography, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FileType } from '../../../types/file';
import {
	Autocomplete,
	SelectOption
} from '@craigmiller160/react-hook-form-material-ui';
import { match } from 'ts-pattern';
import { FileChooser } from '../../UI/FileChooser';

interface FormData {
	readonly file?: File;
	readonly fileType: SelectOption<FileType>;
}

const getFileTypeLabel = (fileType: FileType): string =>
	match(fileType)
		.with(FileType.DISCOVER_CSV, () => 'Discover (CSV)')
		.with(FileType.CHASE_CSV, () => 'Chase (CSV)')
		.run();

const FILE_TYPES = Object.keys(FileType)
	.map(
		(key): SelectOption<FileType> => ({
			value: key as FileType,
			label: getFileTypeLabel(key as FileType)
		})
	)
	.sort((a, b) => a.label.localeCompare(b.label));

export const Import = () => {
	const { control, handleSubmit } = useForm<FormData>({
		defaultValues: {
			fileType: FILE_TYPES[0]
		}
	});
	const theme = useTheme();

	const onSubmit = (values: FormData) => {};

	const result = theme.breakpoints.up('xs');
	console.log(result);

	return (
		<div className="ImportTransactions">
			<div className="TitleWrapper">
				<Typography variant="h4">Import Transactions</Typography>
			</div>
			<form className="ImportForm" onSubmit={handleSubmit(onSubmit)}>
				<Autocomplete
					name="fileType"
					control={control}
					label="File Type"
					options={FILE_TYPES}
				/>
				<FileChooser
					name="file"
					control={control}
					rules={{ required: 'File is required' }}
				/>
				<Button variant="contained" type="submit">
					Submit
				</Button>
			</form>
		</div>
	);
};
