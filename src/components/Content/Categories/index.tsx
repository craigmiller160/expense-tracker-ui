import { Button, TableCell, TableRow } from '@mui/material';
import './Categories.scss';
import {
	CreateCategoryMutation,
	DeleteCategoryMutation,
	UpdateCategoryMutation,
	useCreateCategory,
	useDeleteCategory,
	useGetAllCategories,
	useUpdateCategory
} from '../../../ajaxapi/query/CategoryQueries';
import { Table } from '../../UI/Table';
import { CategoryDetails, CategoryResponse } from '../../../types/categories';
import { ReactNode } from 'react';
import { CategoryDetailsDialog } from './CategoryDetailsDialog';
import { Updater, useImmer } from 'use-immer';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import * as Option from 'fp-ts/es6/Option';
import { match } from 'ts-pattern';
import {
	NewConfirmDialog,
	useNewConfirmDialog
} from '../../UI/ConfirmDialog/ConfirmDialogProvider';
import { PageTitle } from '../../UI/PageTitle';
import { FullPageTableWrapper } from '../../UI/Table/FullPageTableWrapper';

const COLUMNS = ['Name', 'Actions'];

const dataToRows = (
	updateSelectCategoryDetails: (idOption: OptionT<CategoryDetails>) => void,
	data?: ReadonlyArray<CategoryResponse>
): ReadonlyArray<ReactNode> =>
	(data ?? []).map((category) => (
		<TableRow key={category.id}>
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
	readonly selectedCategoryDetails: OptionT<CategoryDetails>;
}

const createUpdateSelectedCategoryDetails =
	(setState: Updater<State>) => (category: OptionT<CategoryDetails>) =>
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
					id: c.id!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
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

	return (
		<div className="Categories">
			<PageTitle title="Manage Categories" />
			<FullPageTableWrapper className="TableWrapper">
				<Table columns={COLUMNS} loading={isLoading}>
					{Rows}
				</Table>
				<div className="ActionWrapper">
					<Button
						variant="contained"
						color="secondary"
						onClick={onNewCategory}
					>
						Add
					</Button>
				</div>
			</FullPageTableWrapper>
			<CategoryDetailsDialog
				selectedCategory={state.selectedCategoryDetails}
				onClose={() => updateSelectedCategoryDetails(Option.none)}
				saveCategory={saveCategory}
				deleteCategory={deleteCategory}
			/>
		</div>
	);
};
