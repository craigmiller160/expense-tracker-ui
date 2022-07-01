import './ImportTransactions.scss';
import { Button, LinearProgress, Typography, useTheme } from '@mui/material';
import { useForm, UseFormReset } from 'react-hook-form';
import { FileType } from '../../../types/file';
import {
	Autocomplete,
	SelectOption
} from '@craigmiller160/react-hook-form-material-ui';
import { FileChooser } from '@craigmiller160/react-hook-form-material-ui';
import { match } from 'ts-pattern';
import { StyledForm } from './StyledForm';
import {
	ImportTransactionsMutation,
	useImportTransactions
} from '../../../ajaxapi/query/TransactionImportQueries';
import { useEffect } from 'react';

interface FormData {
	readonly file: File | null;
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

const defaultValues: FormData = {
	file: null,
	fileType: FILE_TYPES[0]
};

const createOnSubmit =
	(importTransactions: ImportTransactionsMutation) => (values: FormData) => {
		importTransactions({
			file: values.file!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
			type: values.fileType.value
		});
	};

const useTestFile = (reset: UseFormReset<FormData>) => {
	const search = window.location.search;
	useEffect(() => {
		if (search.includes('IS_TEST=true')) {
			reset({
				...defaultValues,
				file: new File([], 'Test.txt')
			});
		}
	}, [search]);
};

export const Import = () => {
	const { control, handleSubmit, reset } = useForm<FormData>({
		defaultValues
	});
	const { mutate, isLoading } = useImportTransactions(() =>
		reset(defaultValues)
	);
	const theme = useTheme();
	const onSubmit = createOnSubmit(mutate);
	useTestFile(reset);

	return (
		<div className="ImportTransactions">
			<div className="TitleWrapper">
				<Typography variant="h4">Import Transactions</Typography>
			</div>
			<StyledForm
				breakpoints={theme.breakpoints}
				className="ImportForm"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Autocomplete
					name="fileType"
					control={control}
					label="File Type"
					options={FILE_TYPES}
					disabled={isLoading}
					rules={{ required: 'File Type is required' }}
				/>
				<FileChooser
					name="file"
					testId="transaction-file-chooser"
					control={control}
					disabled={isLoading}
					rules={{ required: 'File is required' }}
				/>
				{isLoading && <LinearProgress />}
				<Button variant="contained" type="submit" disabled={isLoading}>
					Import
				</Button>
			</StyledForm>
		</div>
	);
};
