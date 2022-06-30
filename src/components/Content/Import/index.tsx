import './ImportTransactions.scss';
import { Button, Input, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FileType } from '../../../types/file';
import { useEffect } from 'react';
import {
	Autocomplete,
	SelectOption
} from '@craigmiller160/react-hook-form-material-ui';
import { match } from 'ts-pattern';

interface FormData {
	readonly file?: File;
	readonly fileType: FileType;
}

const getFileTypeLabel = (fileType: FileType): string =>
	match(fileType)
		.with(FileType.DISCOVER_CSV, () => 'Discover (CSV)')
		.with(FileType.CHASE_CSV, () => 'Chase (CSV)')
		.run();

const FILE_TYPES = Object.keys(FileType).map(
	(key): SelectOption<FileType> => ({
		value: key as FileType,
		label: getFileTypeLabel(key as FileType)
	})
);

export const Import = () => {
	const { control, reset, handleSubmit } = useForm<FormData>();
	useEffect(() => {
		reset({
			fileType: FileType.CHASE_CSV
		});
	}, []);

	const onSubmit = (values: FormData) => {};

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
				<Input type="file" />
				<Button variant="contained">Submit</Button>
			</form>
		</div>
	);
};
