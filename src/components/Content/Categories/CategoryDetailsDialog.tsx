import {
	AppBar,
	Box,
	Button,
	Dialog,
	IconButton,
	Slide,
	Toolbar,
	Typography
} from '@mui/material';
import { forwardRef, ReactElement, Ref, useCallback, useEffect } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import * as Option from 'fp-ts/es6/Option';
import { CategoryDetails } from '../../../types/categories';
import { pipe } from 'fp-ts/es6/function';
import './CategoryDetailsDialog.scss';
import { useForm, UseFormReset } from 'react-hook-form';
import { TextField } from '@craigmiller160/react-hook-form-material-ui';

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement;
	},
	ref: Ref<unknown>
) {
	return <Slide direction="left" ref={ref} {...props} />;
});

interface Props {
	readonly selectedCategory: OptionT<CategoryDetails>;
	readonly onClose: () => void;
	readonly saveCategory: (category: CategoryDetails) => void;
	readonly deleteCategory: (category: CategoryDetails) => void;
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

export const CategoryDetailsDialog = (props: Props) => {
	const title = getTitle(props.selectedCategory);
	const { handleSubmit, control, reset, formState } = useForm<FormData>();
	const hasCategory = Option.isSome(props.selectedCategory);
	const resetForm = useCallback(createResetForm(reset), [reset]);

	useEffect(() => {
		resetForm(props.selectedCategory);
	}, [hasCategory, resetForm]);

	const onSubmit = (values: FormData) => console.log('Data', values);

	return (
		<Dialog
			fullScreen
			onClose={props.onClose}
			open={hasCategory}
			TransitionComponent={Transition}
			className="CategoryDetailsDialog"
		>
			<AppBar sx={{ position: 'relative' }}>
				<Toolbar>
					<Typography variant="h6">{title}</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<IconButton
						edge="start"
						color="inherit"
						onClick={props.onClose}
					>
						<CloseIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<div className="Body">
				<Typography variant="h6">Category Information</Typography>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						className="NameField"
						name="name"
						control={control}
						label="Category Name"
					/>
					<div className="Actions">
						<Button
							variant="contained"
							color="success"
							disabled={!formState.isDirty && !isNewCategory(props.selectedCategory)}
						>
							Save
						</Button>
						{!isNewCategory(props.selectedCategory) && (
							<Button variant="contained" color="error">
								Delete
							</Button>
						)}
					</div>
				</form>
			</div>
		</Dialog>
	);
};
