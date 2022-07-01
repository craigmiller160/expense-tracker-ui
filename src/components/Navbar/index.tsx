import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useDeriveNavbarFromAuthUser } from './useDeriveNavbarFromAuthUser';
import { Link } from 'react-router-dom';
import { LinkButton } from './LinkButton';

export const Navbar = () => {
	const {
		authButtonText,
		authButtonAction,
		isAuthorized,
		hasCheckedAuthorization
	} = useDeriveNavbarFromAuthUser();
	return (
		<Box sx={{ flexGrow: 1 }} className="Navbar">
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
							<LinkButton
								to="/expense-tracker/categories"
								label="Manage Categories"
							/>
							<LinkButton
								to="/expense-tracker/import"
								label="Import Transactions"
							/>
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
