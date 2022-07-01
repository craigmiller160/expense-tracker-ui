import {
	Paper,
	TableContainer,
	Table as MuiTable,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	LinearProgress,
	TableFooter,
	TablePagination
} from '@mui/material';
import { MouseEvent, ChangeEvent, PropsWithChildren } from 'react';
import './Table.scss';

export interface TablePaginationConfig {
	readonly totalRecords: number;
	readonly recordsPerPage: number;
	readonly currentPage: number;
	readonly onChangePage: (
		event: MouseEvent<HTMLButtonElement> | null,
		page: number
	) => void;
	readonly onRowsPerPageChange: (
		event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => void;
}

interface Props {
	readonly columns: ReadonlyArray<string>;
	readonly loading?: boolean;
	readonly pagination?: TablePaginationConfig;
}

export const Table = (props: PropsWithChildren<Props>) => (
	<TableContainer component={Paper}>
		<MuiTable>
			<TableHead>
				<TableRow>
					{props.columns.map((col) => (
						<TableCell key={col}>{col}</TableCell>
					))}
				</TableRow>
			</TableHead>
			{!props.loading && (
				<>
					<TableBody>{props.children}</TableBody>
					<TableFooter>
						{props.pagination && (
							<TablePagination
								count={props.pagination.totalRecords}
								page={props.pagination.currentPage}
								rowsPerPage={props.pagination.recordsPerPage}
								onPageChange={props.pagination.onChangePage}
								onRowsPerPageChange={
									props.pagination.onRowsPerPageChange
								}
							/>
						)}
					</TableFooter>
				</>
			)}
		</MuiTable>
		{props.loading && <LinearProgress />}
	</TableContainer>
);
