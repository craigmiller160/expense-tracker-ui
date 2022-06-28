import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useDeriveNavbarFromAuthUser } from './useDeriveNavbarFromAuthUser';

export const Navbar = () => {
	const { authButtonText, authButtonAction } = useDeriveNavbarFromAuthUser();
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div">
						Expense Tracker
					</Typography>
					<Box sx={{ marginRight: '0.5rem' }} />
					<Box sx={{ flexGrow: 1 }} />
					<Button color="inherit" onClick={authButtonAction}>
						{authButtonText}
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
