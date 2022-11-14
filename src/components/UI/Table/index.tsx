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
	readonly columns: ReadonlyArray<string | ReactNode>;
	readonly aboveTableActions?: ReadonlyArray<ReactNode>;
	readonly belowTableActions?: ReadonlyArray<ReactNode>;
	readonly loading?: boolean;
	readonly pagination?: TablePaginationConfig;
	readonly 'data-testid'?: string;
	readonly className?: string;
}

export const Table = (props: PropsWithChildren<Props>) => {
	const rootClasses = ['AppTable', props.className]
		.filter((c) => !!c)
		.join(' ');
	const headerClass = props.className ? `${props.className}-header` : '';
	const bodyClass = props.className ? `${props.className}-body` : '';
	return (
		<div className={rootClasses} data-testid={props['data-testid']}>
			<TableContainer component={Paper}>
				{!props.loading && (
					<div className="ActionWrapper AboveTableActionWrapper">
						{props.aboveTableActions}
					</div>
				)}
				<MuiTable>
					<TableHead className={headerClass}>
						<TableRow>
							{props.columns.map((col, index) => (
								<TableCell key={index}>{col}</TableCell>
							))}
						</TableRow>
					</TableHead>
					{!props.loading && (
						<>
							<TableBody className={bodyClass}>
								{props.children}
							</TableBody>
							<TableFooter>
								{props.pagination && (
									<TablePagination
										data-testid="table-pagination"
										count={props.pagination.totalRecords}
										page={props.pagination.currentPage}
										rowsPerPage={
											props.pagination.recordsPerPage
										}
										onPageChange={
											props.pagination.onChangePage
										}
										onRowsPerPageChange={
											props.pagination
												.onRecordsPerPageChange
										}
									/>
								)}
							</TableFooter>
						</>
					)}
				</MuiTable>
				{props.loading && (
					<LinearProgress data-testid="table-loading" />
				)}
				{!props.loading && (
					<div className="ActionWrapper BelowTableActionWrapper">
						{props.belowTableActions}
					</div>
				)}
			</TableContainer>
		</div>
	);
};
