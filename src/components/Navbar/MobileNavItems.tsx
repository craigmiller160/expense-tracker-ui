import { MouseEvent } from 'react';
import { useDeriveNavbarFromAuthUser } from './useDeriveNavbarFromAuthUser';
import { useImmer } from 'use-immer';
import { castDraft } from 'immer';
import { Button, Menu, MenuItem } from '@mui/material';
import './MobileNavItems.scss';

type OpenMenu = (event: MouseEvent<HTMLButtonElement>) => void;
type CloseMenu = () => void;

interface UseMenuControlsReturn {
	readonly open: boolean;
	readonly anchor?: HTMLElement;
	readonly openMenu: OpenMenu;
	readonly closeMenu: CloseMenu;
}

interface UseMenuControlsState {
	readonly anchor?: HTMLElement;
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
			{hasCheckedAuthorization && (
				<Button color="inherit" onClick={authButtonAction}>
					{authButtonText}
				</Button>
			)}
		</div>
	);
};
