import type { MouseEvent } from 'react';
import { useEffect } from 'react';
import { useDeriveNavbarFromAuthUser } from './useDeriveNavbarFromAuthUser';
import { useImmer } from 'use-immer';
import { castDraft } from 'immer';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import './MobileNavItems.scss';
import { useLocation, useNavigate } from 'react-router';
import type { NavbarItem } from './items';
import {
	IMPORT_TRANSACTIONS_LABEL,
	IMPORT_TRANSACTIONS_TO,
	MANAGE_CATEGORIES_LABEL,
	MANAGE_CATEGORIES_TO,
	MANAGE_TRANSACTIONS_LABEL,
	MANAGE_TRANSACTIONS_TO,
	NAVBAR_ITEMS,
	REPORTS_LABEL,
	REPORTS_TO,
	RULES_LABEL,
	RULES_TO
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

type MatchValue = {
	readonly pathname: string;
	readonly isAuthorized: boolean;
};

const pathStartsWith =
	(prefix: string) =>
	(value: MatchValue): boolean =>
		value.pathname.startsWith(prefix);

const findCurrentLabel = (pathname: string, isAuthorized: boolean): string =>
	match({ pathname, isAuthorized })
		.with({ isAuthorized: false }, () => '')
		.when(pathStartsWith(REPORTS_TO), () => REPORTS_LABEL)
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
		.when(pathStartsWith(RULES_TO), () => RULES_LABEL)
		.with({ pathname: '/' }, () => MANAGE_TRANSACTIONS_LABEL)
		.with({ isAuthorized: true }, () => '')
		.run();

const useMenuNavigation = (
	isAuthorized: boolean,
	closeMenu: CloseMenu
): UseMenuNavigationReturn => {
	const location = useLocation();
	const navigate = useNavigate();
	const [state, setState] = useImmer<UseMenuNavigationState>({
		currentLabel: ''
	});

	useEffect(() => {
		setState((draft) => {
			draft.currentLabel = findCurrentLabel(
				location.pathname,
				isAuthorized
			);
		});
	}, [location.pathname, setState, isAuthorized]);

	const selectNavItem: SelectNavItem = (item) => () => {
		navigate(item.to);
		closeMenu();
	};

	return {
		currentLabel: state.currentLabel,
		selectNavItem
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
	const { currentLabel, selectNavItem } = useMenuNavigation(
		isAuthorized,
		closeMenu
	);

	return (
		<div className="mobile-nav-items">
			{isAuthorized && (
				<Button
					id="mobile-nav-items-button"
					aria-controls={open ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={openMenu}
					color="inherit"
				>
					{currentLabel}
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
				{NAVBAR_ITEMS.map((item) => (
					<MenuItem
						className="NavbarItem"
						key={item.to}
						onClick={selectNavItem(item)}
					>
						{item.label}
					</MenuItem>
				))}
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
