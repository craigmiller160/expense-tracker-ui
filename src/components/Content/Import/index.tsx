import './ImportTransactions.scss';
import { Button, LinearProgress, Paper, useTheme } from '@mui/material';
import type { UseFormSetValue } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { FileType } from '../../../types/file';
import type { SelectOption } from '@craigmiller160/react-hook-form-material-ui';
import {
	Autocomplete,
	FileChooser
} from '@craigmiller160/react-hook-form-material-ui';
import { match } from 'ts-pattern';
import { StyledForm } from './StyledForm';
import type {
	ImportTransactionsMutation,
	UseImportTransactionsType
} from '../../../ajaxapi/query/TransactionImportQueries';
import { useImportTransactions as useImportTransactionsFn } from '../../../ajaxapi/query/TransactionImportQueries';
import type { MutableRefObject } from 'react';
import { useRef } from 'react';
import { PageTitle } from '../../UI/PageTitle';
import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';

interface FormData {
	readonly file: File | null;
	readonly fileType: SelectOption<FileType> | null;
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
		if (values.file && values.fileType?.value) {
			importTransactions({
				file: values.file,
				type: values.fileType.value
			});
		}
	};

const createReset =
	(
		ref: MutableRefObject<HTMLInputElement | undefined>,
		setValue: UseFormSetValue<FormData>
	) =>
	() => {
		setValue('file', null);
		if (ref.current) {
			ref.current.value = '';
		}
	};

type Props = Readonly<{
	useImportTransactions?: UseImportTransactionsType;
}>;

export const Import = ({
	useImportTransactions = useImportTransactionsFn
}: Props) => {
	const { control, handleSubmit, setValue } = useForm<FormData>({
		defaultValues
	});
	const fileInputRef = useRef<HTMLInputElement>();
	const { mutate, isLoading } = useImportTransactions(
		createReset(fileInputRef, setValue)
	);
	const theme = useTheme();
	const onSubmit = createOnSubmit(mutate);
	const fileChooserRules = { required: 'File Type is required' };

	return (
		<PageResponsiveWrapper className="import-transactions">
			<PageTitle title="Import Transactions" />
			<Paper className="import-form-container">
				<StyledForm
					breakpoints={theme.breakpoints}
					className="import-form"
					onSubmit={handleSubmit(onSubmit)}
				>
					<Autocomplete
						name="fileType"
						control={control}
						label="File Type"
						options={FILE_TYPES}
						disabled={isLoading}
						rules={fileChooserRules}
					/>
					<FileChooser
						name="file"
						testId="transaction-file-chooser"
						control={control}
						inputRef={fileInputRef}
						disabled={isLoading}
						label="Transaction File"
						rules={{ required: 'File is required' }}
					/>
					{isLoading && <LinearProgress />}
					<Button
						variant="contained"
						type="submit"
						disabled={isLoading}
					>
						Import
					</Button>
				</StyledForm>
			</Paper>
		</PageResponsiveWrapper>
	);
};
