import {
	Paper,
	TableContainer,
	Table as MuiTable,
	TableHead,
	TableRow,
	TableCell,
	TableBody
} from '@mui/material';
import { PropsWithChildren } from 'react';
import './Table.scss';

interface Props {
	readonly columns: ReadonlyArray<string>;
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
			<TableBody>{props.children}</TableBody>
		</MuiTable>
	</TableContainer>
);
