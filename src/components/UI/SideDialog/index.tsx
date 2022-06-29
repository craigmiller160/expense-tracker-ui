import {
	AppBar,
	Box,
	Dialog,
	IconButton,
	Slide,
	Toolbar,
	Typography
} from '@mui/material';
import { forwardRef, PropsWithChildren, ReactElement, Ref } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import './SideDialog.scss';

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement;
	},
	ref: Ref<unknown>
) {
	return <Slide direction="left" ref={ref} {...props} />;
});

interface Props {
	readonly title: string;
	readonly open: boolean;
	readonly onClose: () => void;
}

export const SideDialog = (props: PropsWithChildren<Props>) => {
	return (
		<Dialog
			fullScreen
			onClose={props.onClose}
			open={props.open}
			TransitionComponent={Transition}
			className="SideDialog"
		>
			<AppBar sx={{ position: 'relative' }}>
				<Toolbar>
					<Typography variant="h6">{props.title}</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<IconButton
						edge="start"
						color="inherit"
						onClick={props.onClose}
					>
						<CloseIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<div className="Body">{props.children}</div>
		</Dialog>
	);
};
