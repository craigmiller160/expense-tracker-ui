import { MouseEvent, useEffect } from 'react';
import { useDeriveNavbarFromAuthUser } from './useDeriveNavbarFromAuthUser';
import { useImmer } from 'use-immer';
import { castDraft } from 'immer';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import './MobileNavItems.scss';
import { useLocation } from 'react-router';
import {
	IMPORT_TRANSACTIONS_LABEL,
	IMPORT_TRANSACTIONS_TO,
	MANAGE_CATEGORIES_LABEL,
	MANAGE_CATEGORIES_TO,
	MANAGE_TRANSACTIONS_LABEL,
	MANAGE_TRANSACTIONS_TO,
	NAVBAR_ITEMS,
	NavbarItem
} from './items';
import { match } from 'ts-pattern';

type OpenMenu = (event: MouseEvent<HTMLButtonElement>) => void;
type CloseMenu = () => void;
type SelectNavItem = (item: NavbarItem) => () => void;

interface UseMenuControlsReturn {
	readonly open: boolean;
	readonly anchor?: HTMLElement;
	readonly openMenu: OpenMenu;
	readonly closeMenu: CloseMenu;
}

interface UseMenuControlsState {
	readonly anchor?: HTMLElement;
}

interface UseMenuNavigationState {
	readonly currentLabel: string;
}

interface UseMenuNavigationReturn {
	readonly currentLabel: string;
	readonly selectNavItem: SelectNavItem;
}

const useMenuControls = (): UseMenuControlsReturn => {
	const [state, setState] = useImmer<UseMenuControlsState>({});

	const openMenu: OpenMenu = (event) =>
		setState((draft) => {
			draft.anchor = castDraft(event.currentTarget);
		});
	const closeMenu: CloseMenu = () =>
		setState((draft) => {
			draft.anchor = undefined;
		});

	return {
		open: state.anchor !== undefined,
		anchor: state.anchor,
		openMenu,
		closeMenu
	};
};

const pathStartsWith =
	(prefix: string) =>
	(path: string): boolean =>
		path.startsWith(prefix);

const findCurrentLabel = (pathname: string): string =>
	match(pathname)
		.when(
			pathStartsWith(MANAGE_TRANSACTIONS_TO),
			() => MANAGE_TRANSACTIONS_LABEL
		)
		.when(
			pathStartsWith(MANAGE_CATEGORIES_TO),
			() => MANAGE_CATEGORIES_LABEL
		)
		.when(
			pathStartsWith(IMPORT_TRANSACTIONS_TO),
			() => IMPORT_TRANSACTIONS_LABEL
		)
		.with('/', () => MANAGE_TRANSACTIONS_LABEL)
		.run();

const useMenuNavigation = (closeMenu: CloseMenu): UseMenuNavigationReturn => {
	const location = useLocation();
	const [state, setState] = useImmer<UseMenuNavigationState>({
		currentLabel: ''
	});

	useEffect(() => {
		setState((draft) => {
			draft.currentLabel = findCurrentLabel(location.pathname);
		});
	}, [location.pathname, setState]);

	return {
		currentLabel: state.currentLabel,
		selectNavItem: () => () => {}
	};
};

export const MobileNavItems = () => {
	const {
		authButtonText,
		authButtonAction,
		isAuthorized,
		hasCheckedAuthorization
	} = useDeriveNavbarFromAuthUser();
	const { open, anchor, openMenu, closeMenu } = useMenuControls();

	return (
		<div className="MobileNavItems">
			{isAuthorized && (
				<Button
					id="mobile-nav-items-button"
					aria-controls={open ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={openMenu}
					color="inherit"
				>
					Testing 123
				</Button>
			)}
			<Menu
				open={open}
				anchorEl={anchor}
				onClose={closeMenu}
				MenuListProps={{
					'aria-labelledby': 'mobile-nav-items-button'
				}}
			>
				<MenuItem onClick={closeMenu}>Profile</MenuItem>
				<MenuItem onClick={closeMenu}>My account</MenuItem>
				<MenuItem onClick={closeMenu}>Logout</MenuItem>
			</Menu>
			{!isAuthorized && <Box sx={{ flexGrow: 1 }} />}
			{hasCheckedAuthorization && (
				<Button color="inherit" onClick={authButtonAction}>
					{authButtonText}
				</Button>
			)}
		</div>
	);
};
