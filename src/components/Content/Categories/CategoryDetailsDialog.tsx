import { Button, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import * as Option from 'fp-ts/es6/Option';
import { CategoryDetails } from '../../../types/categories';
import { pipe } from 'fp-ts/es6/function';
import './CategoryDetailsDialog.scss';
import { FormState, useForm, UseFormReset } from 'react-hook-form';
import { TextField } from '@craigmiller160/react-hook-form-material-ui';
import { SideDialog } from '../../UI/SideDialog';

interface Props {
	readonly selectedCategory: OptionT<CategoryDetails>;
	readonly onClose: () => void;
	readonly saveCategory: (category: CategoryDetails) => void;
	readonly deleteCategory: (id?: string) => void;
}

interface FormData {
	readonly name: string;
}

const getTitle = (selectedCategory: OptionT<CategoryDetails>): string =>
	pipe(
		selectedCategory,
		Option.map((category) =>
			category.isNew ? 'New Category' : `Category: ${category.name}`
		),
		Option.getOrElse(() => '')
	);

const isNewCategory = (selectedCategory: OptionT<CategoryDetails>): boolean =>
	Option.fold<CategoryDetails, boolean>(
		() => false,
		(cat) => cat.isNew
	)(selectedCategory);

const createResetForm =
	(reset: UseFormReset<FormData>) =>
	(selectedCategory: OptionT<CategoryDetails>) => {
		const data = pipe(
			selectedCategory,
			Option.fold(
				(): FormData => ({
					name: ''
				}),
				(category): FormData => ({
					name: category.isNew ? 'New Category' : category.name
				})
			)
		);
		reset(data);
	};

const getCategoryId = (
	selectedCategory: OptionT<CategoryDetails>
): string | undefined =>
	Option.fold<CategoryDetails, string | undefined>(
		() => undefined,
		(cat) => cat.id
	)(selectedCategory);

const prepareOutput = (
	selectedCategory: OptionT<CategoryDetails>,
	formData: FormData
): CategoryDetails =>
	pipe(
		selectedCategory,
		Option.map(
			(cat): CategoryDetails => ({
				...cat,
				name: formData.name
			})
		),
		Option.getOrElse(
			(): CategoryDetails => ({
				isNew: false,
				name: ''
			})
		)
	);

const formHasErrors = (formState: FormState<FormData>): boolean =>
	Object.keys(formState.errors).length > 0;

export const CategoryDetailsDialog = (props: Props) => {
	const title = getTitle(props.selectedCategory);
	const { handleSubmit, control, reset, formState } = useForm<FormData>();
	const hasCategory = Option.isSome(props.selectedCategory);
	const resetForm = useCallback(createResetForm(reset), [reset]);

	useEffect(() => {
		resetForm(props.selectedCategory);
	}, [hasCategory, resetForm]);

	const onSubmit = (values: FormData) =>
		props.saveCategory(prepareOutput(props.selectedCategory, values));

	return (
		<SideDialog title={title} open={hasCategory} onClose={props.onClose}>
			<div className="CategoryDetailsDialog">
				<Typography variant="h6">Category Information</Typography>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						className="NameField"
						name="name"
						control={control}
						label="Category Name"
						rules={{
							required: 'Must provide a name'
						}}
					/>
					<div className="Actions">
						<Button
							variant="contained"
							color="success"
							type="submit"
							disabled={
								(formState.isDirty &&
									formHasErrors(formState)) ||
								(!formState.isDirty &&
									!isNewCategory(props.selectedCategory))
							}
						>
							Save
						</Button>
						{!isNewCategory(props.selectedCategory) && (
							<Button
								variant="contained"
								color="error"
								onClick={() =>
									props.deleteCategory(
										getCategoryId(props.selectedCategory)
									)
								}
							>
								Delete
							</Button>
						)}
					</div>
				</form>
			</div>
		</SideDialog>
	);
};
