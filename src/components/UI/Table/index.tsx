import {
	LinearProgress,
	Paper,
	Table as MuiTable,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow
} from '@mui/material';
import { ChangeEvent, MouseEvent, PropsWithChildren, ReactNode } from 'react';
import './Table.scss';

export interface TablePaginationConfig {
	readonly totalRecords: number;
	readonly recordsPerPage: number;
	readonly currentPage: number;
	readonly onChangePage: (
		event: MouseEvent<HTMLButtonElement> | null,
		page: number
	) => void;
	readonly onRecordsPerPageChange: (
		event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => void;
}

interface Props {
	readonly columns: ReadonlyArray<string>;
	readonly belowTableActions?: ReadonlyArray<ReactNode>;
	readonly loading?: boolean;
	readonly pagination?: TablePaginationConfig;
	readonly 'data-testid'?: string;
}

export const Table = (props: PropsWithChildren<Props>) => (
	<div className="AppTable" data-testid={props['data-testid']}>
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
									data-testid="table-pagination"
									count={props.pagination.totalRecords}
									page={props.pagination.currentPage}
									rowsPerPage={
										props.pagination.recordsPerPage
									}
									onPageChange={props.pagination.onChangePage}
									onRowsPerPageChange={
										props.pagination.onRecordsPerPageChange
									}
								/>
							)}
						</TableFooter>
					</>
				)}
			</MuiTable>
			{props.loading && <LinearProgress />}
			{!props.loading && (
				<div className="ActionWrapper">{props.belowTableActions}</div>
			)}
		</TableContainer>
	</div>
);
