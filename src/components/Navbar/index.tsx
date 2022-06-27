import { Box } from '@suid/material/Box';
import AppBar from '@suid/material/AppBar';
import Toolbar from '@suid/material/Toolbar';
import Typography from '@suid/material/Typography';
import Button from '@suid/material/Button';
import { authUserResource } from '../../resources/AuthResources';
import { AuthUser } from '../../types/auth';
import { match, P } from 'ts-pattern';
import { DefaultResource } from '../../resources/types';
import { login, logout } from '../../services/AuthService';
import { constVoid } from 'fp-ts/es6/function';

interface DerivedFromAuthUser<T> {
	readonly loading: T;
	readonly failed: T;
	readonly succeeded: T;
}

const deriveFromAuthUser =
	<T,>(derived: DerivedFromAuthUser<T>) =>
	(data: DefaultResource<AuthUser>): T =>
		match({ loading: data.loading, error: data.error })
			.with({ loading: true }, () => derived.loading)
			.with({ loading: false, error: P.nullish }, () => derived.succeeded)
			.otherwise(() => derived.failed);

const getAuthBtnTxt = deriveFromAuthUser({
	loading: '',
	failed: 'Login',
	succeeded: 'Logout'
});

const [, { refetch }] = authUserResource;
type RefetchType = typeof refetch;

const getAuthBtnAction = (refetch: RefetchType) =>
	deriveFromAuthUser({
		loading: constVoid,
		failed: login,
		succeeded: () => logout().then(() => refetch())
	});

export const Navbar = () => {
	const [data, { refetch }] = authUserResource;
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div">
						Expense Tracker
					</Typography>
					<Button color="inherit">Manage Categories</Button>
					<Box sx={{ flexGrow: 1 }} />
					<Button
						onClick={getAuthBtnAction(refetch)(data)}
						color="inherit"
					>
						{getAuthBtnTxt(data)}
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};
