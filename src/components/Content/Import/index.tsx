import './ImportTransactions.scss';
import { Button, LinearProgress, Paper, useTheme } from '@mui/material';
import { useForm, UseFormReset, UseFormSetValue } from 'react-hook-form';
import { FileType } from '../../../types/file';
import {
	Autocomplete,
	FileChooser,
	SelectOption
} from '@craigmiller160/react-hook-form-material-ui';
import { match } from 'ts-pattern';
import { StyledForm } from './StyledForm';
import {
	ImportTransactionsMutation,
	useImportTransactions
} from '../../../ajaxapi/query/TransactionImportQueries';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
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

const useTestFile = (reset: UseFormReset<FormData>): boolean => {
	const [isTest, setIsTest] = useState(false);
	const search = window.location.search;
	useEffect(() => {
		if (search.includes('IS_TEST=true')) {
			reset({
				...defaultValues,
				file: new File([], 'Test.txt')
			});
			setIsTest(true);
		} else {
			setIsTest(false);
		}
	}, [search, reset]);
	return isTest;
};

const createReset =
	(
		ref: MutableRefObject<HTMLInputElement | undefined>,
		setValue: UseFormSetValue<FormData>
	) =>
	() => {
		setValue('file', null);
		if (ref.current) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			ref.current.value = null;
		}
	};

export const Import = () => {
	const { control, handleSubmit, reset, setValue } = useForm<FormData>({
		defaultValues
	});
	const fileInputRef = useRef<HTMLInputElement>();
	const { mutate, isLoading } = useImportTransactions(
		createReset(fileInputRef, setValue)
	);
	const theme = useTheme();
	const onSubmit = createOnSubmit(mutate);
	const isTest = useTestFile(reset);
	const fileChooserRules = isTest
		? undefined
		: { required: 'File Type is required' };

	return (
		<PageResponsiveWrapper className="ImportTransactions">
			<PageTitle title="Import Transactions" />
			<Paper className="ImportFormContainer">
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
