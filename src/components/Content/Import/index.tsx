import './ImportTransactions.scss';
import { Input, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FileType } from '../../../types/file';
import { useEffect } from 'react';

interface FormData {
	readonly file?: File;
	readonly fileType: FileType;
}

export const Import = () => {
	const { control, reset, handleSubmit } = useForm<FormData>();
	useEffect(() => {
		reset({
			fileType: FileType.CHASE_CSV
		});
	}, []);

	const onSubmit = (values: FormData) => {

	};

	return (
		<div className="ImportTransactions">
			<div className="TitleWrapper">
				<Typography variant="h4">Import Transactions</Typography>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input type="file" />
			</form>
		</div>
	);
};
