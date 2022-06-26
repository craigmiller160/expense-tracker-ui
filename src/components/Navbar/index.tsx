import { Box } from '@suid/material/Box';
import AppBar from '@suid/material/AppBar';
import Toolbar from '@suid/material/Toolbar';
import Typography from '@suid/material/Typography';
import Button from '@suid/material/Button';
import { authUserResource } from '../../resources/AuthResources';
import { Resource } from 'solid-js';
import { AuthUser } from '../../types/auth';
import { match, P } from 'ts-pattern';

const getAuthBtnTxt = (data: Resource<AuthUser>) =>
	match({ loading: data.loading, error: data.error })
		.with({ loading: true }, () => '')
		.with({ loading: false, error: P.nullish }, () => 'Logout')
		.otherwise(() => 'Login');

export const Navbar = () => {
	const [data] = authUserResource;
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						Expense Tracker
					</Typography>
					<Button color="inherit">{getAuthBtnTxt(data)}</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
