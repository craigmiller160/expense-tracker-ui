import { AppBar, Box, Toolbar, Typography } from '@mui/material';

interface DerivedFromAuthUser<T> {
	readonly loading: T;
	readonly failed: T;
	readonly succeeded: T;
}

export const Navbar = () => {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div">
						Expense Tracker
					</Typography>
				</Toolbar>
				<Box sx={{ marginRight: '0.5rem' }} />
				<Box sx={{ flexGrow: 1 }} />
			</AppBar>
		</Box>
	);
};
