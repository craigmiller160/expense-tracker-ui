import { Box, Button } from '@mui/material';
import { LinkButton } from './LinkButton';
import { useDeriveNavbarFromAuthUser } from './useDeriveNavbarFromAuthUser';

export const DesktopNavItems = () => {
	const {
		authButtonText,
		authButtonAction,
		isAuthorized,
		hasCheckedAuthorization
	} = useDeriveNavbarFromAuthUser();
	return (
		<>
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
		</>
	);
};
