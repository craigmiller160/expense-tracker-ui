import { Box } from '@suid/material/Box';
import AppBar from '@suid/material/AppBar';
import Toolbar from '@suid/material/Toolbar';
import Typography from '@suid/material/Typography';
import Button from '@suid/material/Button';
import {
	authUserResource,
	hasCheckedAuthStatus,
	isAuthenticated
} from '../../resources/AuthResources';
import { AuthUser } from '../../types/auth';
import { match, P } from 'ts-pattern';
import { DefaultResource } from '../../resources/types';
import { login, logout } from '../../services/AuthService';
import { constVoid } from 'fp-ts/es6/function';
import { LinkButton } from '../UI/LinkButton';

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
					<LinkButton
						path="/"
						label={
							<Typography variant="h6" component="div">
								Expense Tracker
							</Typography>
						}
						color="inherit"
					/>
					<Box sx={{ marginRight: '0.5rem' }} />
					{isAuthenticated() && (
						<LinkButton
							path="/categories"
							color="inherit"
							label="Manage Categories"
						/>
					)}
					<Box sx={{ flexGrow: 1 }} />
					{hasCheckedAuthStatus() && (
						<Button
							onClick={getAuthBtnAction(refetch)(data)}
							color="inherit"
						>
							{getAuthBtnTxt(data)}
						</Button>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
};
