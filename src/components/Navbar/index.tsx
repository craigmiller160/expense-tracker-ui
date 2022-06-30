import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useDeriveNavbarFromAuthUser } from './useDeriveNavbarFromAuthUser';
import { Link } from 'react-router-dom';

export const Navbar = () => {
	const {
		authButtonText,
		authButtonAction,
		isAuthorized,
		hasCheckedAuthorization
	} = useDeriveNavbarFromAuthUser();
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Button
						component={Link}
						to="/expense-tracker"
						color="inherit"
					>
						<Typography variant="h6" component="div">
							Expense Tracker
						</Typography>
					</Button>
					<Box sx={{ marginRight: '1rem' }} />
					{isAuthorized && (
						<>
							<Button
								component={Link}
								to="/expense-tracker/categories"
								color="inherit"
							>
								Manage Categories
							</Button>
							<Button
								component={Link}
								to="/expense-tracker/upload"
								color="inherit"
							>
								Upload Transactions
							</Button>
						</>
					)}
					<Box sx={{ flexGrow: 1 }} />
					{hasCheckedAuthorization && (
						<Button color="inherit" onClick={authButtonAction}>
							{authButtonText}
						</Button>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
};
