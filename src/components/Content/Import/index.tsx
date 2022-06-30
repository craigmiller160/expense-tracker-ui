import './ImportTransactions.scss';
import { Button, LinearProgress, Typography, useTheme } from '@mui/material';
import { useForm, UseFormReset } from 'react-hook-form';
import { FileType } from '../../../types/file';
import {
	Autocomplete,
	SelectOption
} from '@craigmiller160/react-hook-form-material-ui';
import { match } from 'ts-pattern';
import { FileChooser } from '@craigmiller160/react-hook-form-material-ui';
import { StyledForm } from './StyledForm';
import {
	ImportTransactionsMutation,
	useImportTransactions
} from '../../../ajaxapi/query/TransactionImportQueries';

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
	(
		importTransactions: ImportTransactionsMutation,
		reset: UseFormReset<FormData>
	) =>
	(values: FormData) => {
		importTransactions({
			file: values.file!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
			type: values.fileType.value
		});
	};

export const Import = () => {
	const { control, handleSubmit, reset } = useForm<FormData>({
		defaultValues
	});
	const { mutate, isLoading } = useImportTransactions();
	const theme = useTheme();
	const onSubmit = createOnSubmit(mutate, reset);

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
					control={control}
					disabled={isLoading}
					rules={{ required: 'File is required' }}
				/>
				{
					isLoading && <LinearProgress />
				}
				<Button variant="contained" type="submit" disabled={isLoading}>
					Submit
				</Button>
			</StyledForm>
		</div>
	);
};
