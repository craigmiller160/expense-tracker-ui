import { Button, TableCell, TableRow } from '@mui/material';
import './Categories.scss';
import type {
	CreateCategoryMutation,
	DeleteCategoryMutation,
	UpdateCategoryMutation
} from '../../../ajaxapi/query/CategoryQueries';
import {
	useCreateCategory,
	useDeleteCategory,
	useGetAllCategories,
	useUpdateCategory
} from '../../../ajaxapi/query/CategoryQueries';
import { Table } from '../../UI/Table';
import type { CategoryResponse } from '../../../types/generated/expense-tracker';
import type { CategoryDetails } from '../../../types/categories';
import type { ReactNode } from 'react';
import { CategoryDetailsDialog } from './CategoryDetailsDialog';
import type { Updater } from 'use-immer';
import { useImmer } from 'use-immer';
import { types } from '@craigmiller160/ts-functions';
import * as Option from 'fp-ts/Option';
import { match } from 'ts-pattern';
import type { NewConfirmDialog } from '../../UI/ConfirmDialog/ConfirmDialogProvider';
import { useNewConfirmDialog } from '../../UI/ConfirmDialog/ConfirmDialogProvider';
import { PageTitle } from '../../UI/PageTitle';
import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { ColorBox } from '../../UI/ColorBox';

const COLUMNS = ['', 'Name', 'Actions'];

const dataToRows = (
	updateSelectCategoryDetails: (
		idOption: types.OptionT<CategoryDetails>
	) => void,
	data?: ReadonlyArray<CategoryResponse>
): ReadonlyArray<ReactNode> =>
	(data ?? []).map((category) => (
		<TableRow key={category.id}>
			<TableCell>
				<ColorBox color={category.color} />
			</TableCell>
			<TableCell>{category.name}</TableCell>
			<TableCell>
				<Button
					variant="contained"
					color="info"
					onClick={() =>
						updateSelectCategoryDetails(
							Option.some({
								...category,
								isNew: false
							})
						)
					}
				>
					Details
				</Button>
			</TableCell>
		</TableRow>
	));

interface State {
	readonly selectedCategoryDetails: types.OptionT<CategoryDetails>;
}

const createUpdateSelectedCategoryDetails =
	(setState: Updater<State>) => (category: types.OptionT<CategoryDetails>) =>
		setState((draft) => {
			draft.selectedCategoryDetails = category;
		});

const createSaveCategory =
	(
		createMutate: CreateCategoryMutation,
		updateMutate: UpdateCategoryMutation,
		closeDialog: () => void
	) =>
	(category: CategoryDetails) => {
		match(category)
			.with({ isNew: true }, (c) =>
				createMutate({
					name: c.name
				})
			)
			.otherwise((c) =>
				updateMutate({
					id: c.id!,
					name: c.name
				})
			);
		closeDialog();
	};

const createDeleteCategory =
	(
		deleteMutate: DeleteCategoryMutation,
		closeDialog: () => void,
		newConfirmDialog: NewConfirmDialog
	) =>
	(id?: string) => {
		const doDelete = () => {
			if (id) {
				deleteMutate({
					id
				});
			}
		};
		newConfirmDialog(
			'Confirm Deletion',
			'Are you sure you want to delete this Category?',
			() => {
				doDelete();
				closeDialog();
			}
		);
	};

export const Categories = () => {
	const [state, setState] = useImmer<State>({
		selectedCategoryDetails: Option.none
	});
	const { data, isLoading } = useGetAllCategories();
	const { mutate: updateMutate } = useUpdateCategory();
	const { mutate: createMutate } = useCreateCategory();
	const { mutate: deleteMutate } = useDeleteCategory();
	const newConfirmDialog = useNewConfirmDialog();

	const updateSelectedCategoryDetails =
		createUpdateSelectedCategoryDetails(setState);
	const Rows = dataToRows(updateSelectedCategoryDetails, data);

	const onNewCategory = () =>
		updateSelectedCategoryDetails(
			Option.some({
				name: '',
				isNew: true
			})
		);

	const saveCategory = createSaveCategory(createMutate, updateMutate, () =>
		updateSelectedCategoryDetails(Option.none)
	);
	const deleteCategory = createDeleteCategory(
		deleteMutate,
		() => updateSelectedCategoryDetails(Option.none),
		newConfirmDialog
	);

	const aboveTableActions = [
		<Button
			key="add-category-button"
			variant="contained"
			color="primary"
			onClick={onNewCategory}
		>
			Add Category
		</Button>
	];

	return (
		<PageResponsiveWrapper className="categories">
			<PageTitle title="Manage Categories" />
			<div className="table-wrapper">
				<Table
					columns={COLUMNS}
					loading={isLoading}
					aboveTableActions={aboveTableActions}
				>
					{Rows}
				</Table>
			</div>
			<CategoryDetailsDialog
				selectedCategory={state.selectedCategoryDetails}
				onClose={() => updateSelectedCategoryDetails(Option.none)}
				saveCategory={saveCategory}
				deleteCategory={deleteCategory}
			/>
		</PageResponsiveWrapper>
	);
};
