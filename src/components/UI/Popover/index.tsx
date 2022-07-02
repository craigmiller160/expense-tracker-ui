import { PropsWithChildren, useRef } from 'react';
import MuiPopover from '@mui/material/Popover';
import { useImmer } from 'use-immer';
import { Typography } from '@mui/material';
import './Popover.scss';

interface State {
	readonly open: boolean;
}

interface Props {
	readonly message: string;
}

export const Popover = (props: PropsWithChildren<Props>) => {
	const [state, setState] = useImmer<State>({
		open: false
	});
	const ref = useRef<HTMLDivElement>(null);
	const openPopover = () =>
		setState((draft) => {
			draft.open = true;
		});
	const closePopover = () =>
		setState((draft) => {
			draft.open = false;
		});
	return (
		<div
			className="AppPopover"
			ref={ref}
			onMouseEnter={openPopover}
			onMouseLeave={closePopover}
		>
			{props.children}
			<MuiPopover
				open={state.open}
				anchorEl={ref.current}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left'
				}}
			>
				<Typography>{props.message}</Typography>
			</MuiPopover>
		</div>
	);
};
