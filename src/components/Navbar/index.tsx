import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useDeriveNavbarFromAuthUser } from './useDeriveNavbarFromAuthUser';
import { Link } from 'react-router-dom';
import { LinkButton } from './LinkButton';
import './Navbar.scss';

export const Navbar = () => {
	const {
		authButtonText,
		authButtonAction,
		isAuthorized,
		hasCheckedAuthorization
	} = useDeriveNavbarFromAuthUser();
	return (
		<Box sx={{ flexGrow: 1, display: 'flex' }} className="Navbar">
			<AppBar position="static" component="nav">
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
								to="/expense-tracker/transactions"
								label="Manage Transactions"
							/>
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
