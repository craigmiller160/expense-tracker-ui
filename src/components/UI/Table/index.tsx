import {
	Paper,
	TableContainer,
	Table as MuiTable,
	TableHead,
	TableRow,
	TableCell,
	TableBody, LinearProgress
} from '@mui/material';
import { PropsWithChildren } from 'react';
import './Table.scss';

interface Props {
	readonly columns: ReadonlyArray<string>;
	readonly loading?: boolean;
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
			{props.loading && <LinearProgress />}
			{!props.loading && <TableBody>{props.children}</TableBody>}
		</MuiTable>
	</TableContainer>
);
