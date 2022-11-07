import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { DesktopNavItems } from './DesktopNavItems';
import { useIsExactlyBreakpoint } from '../../utils/breakpointHooks';
import { MobileNavItems } from './MobileNavItems';

export const Navbar = () => {
	const isMobile = useIsExactlyBreakpoint('xs');
	const toolbarClass = isMobile ? 'MobileToolbar' : '';
	const titleSpace = isMobile ? <br /> : ' ';
	return (
		<Box
			sx={{ flexGrow: 1, display: 'flex' }}
			className="Navbar"
			id="navbar"
		>
			<AppBar position="static" component="nav">
				<Toolbar className={toolbarClass}>
					<Button
						component={Link}
						to="/expense-tracker"
						color="inherit"
					>
						<Typography
							id="expense-tracker-navbar-title"
							variant="h6"
							component="div"
						>
							Expense
							{titleSpace}
							Tracker
						</Typography>
					</Button>
					{isMobile && <MobileNavItems />}
					{!isMobile && <DesktopNavItems />}
				</Toolbar>
			</AppBar>
		</Box>
	);
};
