import {
	Paper,
	TableContainer,
	Table as MuiTable,
	TableHead,
	TableRow,
	TableCell
} from '@mui/material';

interface Props {
	readonly columns: ReadonlyArray<string>;
}

export const Table = (props: Props) => (
	<TableContainer component={Paper}>
		<MuiTable>
			<TableHead>
				<TableRow>
					{props.columns.map((col) => (
						<TableCell key={col}>{col}</TableCell>
					))}
				</TableRow>
			</TableHead>
		</MuiTable>
	</TableContainer>
);
