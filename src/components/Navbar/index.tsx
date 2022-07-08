import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { DesktopNavItems } from './DesktopNavItems';
import { useIsExactlyBreakpoint } from '../../utils/useIsExactlyBreakpoint';
import { MobileNavItems } from './MobileNavItems';

export const Navbar = () => {
	const isMobile = useIsExactlyBreakpoint('xs');
	const toolbarClass = isMobile ? 'MobileToolbar' : '';
	return (
		<Box sx={{ flexGrow: 1, display: 'flex' }} className="Navbar">
			<AppBar position="static" component="nav">
				<Toolbar className={toolbarClass}>
					<Button
						component={Link}
						to="/expense-tracker"
						color="inherit"
					>
						<Typography variant="h6" component="div">
							Expense Tracker
						</Typography>
					</Button>
					{isMobile && <MobileNavItems />}
					{!isMobile && <DesktopNavItems />}
				</Toolbar>
			</AppBar>
		</Box>
	);
};
