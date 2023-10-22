import type { PropsWithChildren, MouseEvent } from 'react';
import MuiPopover from '@mui/material/Popover';
import { useImmer } from 'use-immer';
import { Typography } from '@mui/material';
import './Popover.scss';
import { castDraft } from 'immer';

interface State {
	readonly target: HTMLElement | null;
}

interface Props {
	readonly message: string;
	readonly className?: string;
	readonly 'data-testid'?: string;
}

export const Popover = (props: PropsWithChildren<Props>) => {
	const [state, setState] = useImmer<State>({
		target: null
	});
	const openPopover = (event: MouseEvent<HTMLElement>) =>
		setState((draft) => {
			draft.target = castDraft(event.target as HTMLElement);
		});
	const closePopover = () =>
		setState((draft) => {
			draft.target = null;
		});
	const classes = ['app-popover', props.className]
		.filter((c) => c !== undefined)
		.join(' ');
	return (
		<div
			className={classes}
			onMouseEnter={openPopover}
			onMouseLeave={closePopover}
			data-testid={`${props['data-testid']}`}
		>
			{props.children}
			<MuiPopover
				sx={{
					pointerEvents: 'none'
				}}
				open={!!state.target}
				anchorEl={state.target}
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
