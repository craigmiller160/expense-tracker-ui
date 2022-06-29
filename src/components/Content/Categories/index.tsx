import { Button, TableCell, TableRow, Typography } from '@mui/material';
import './Categories.scss';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { Table } from '../../UI/Table';
import { CategoryDetails, CategoryResponse } from '../../../types/categories';
import { ReactNode } from 'react';
import { CategoryDetailsDialog } from './CategoryDetailsDialog';
import { Updater, useImmer } from 'use-immer';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import * as Option from 'fp-ts/es6/Option';

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

export const Categories = () => {
	const [state, setState] = useImmer<State>({
		selectedCategoryDetails: Option.none
	});
	const { data, isLoading } = useGetAllCategories();
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

	return (
		<div className="Categories">
			<div className="TitleWrapper">
				<Typography variant="h4">Manage Categories</Typography>
			</div>
			<div className="TableWrapper">
				<div className="ActionWrapper">
					<Button
						variant="contained"
						color="secondary"
						onClick={onNewCategory}
					>
						Add
					</Button>
				</div>
				<Table columns={COLUMNS} loading={isLoading}>
					{Rows}
				</Table>
			</div>
			<CategoryDetailsDialog
				selectedCategory={state.selectedCategoryDetails}
				onClose={() => updateSelectedCategoryDetails(Option.none)}
				saveCategory={() => {}}
				deleteCategory={() => {}}
			/>
		</div>
	);
};
