import { Box, Button } from '@mui/material';
import { LinkButton } from './LinkButton';
import { useDeriveNavbarFromAuthUser } from './useDeriveNavbarFromAuthUser';
import { NAVBAR_ITEMS } from './items';

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
					{NAVBAR_ITEMS.map((item) => (
						<LinkButton
							key={item.to}
							to={item.to}
							label={item.label}
						/>
					))}
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
