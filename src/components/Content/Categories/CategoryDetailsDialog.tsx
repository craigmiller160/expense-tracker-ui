import { AppBar, Dialog, IconButton, Slide, Toolbar } from '@mui/material';
import { forwardRef, ReactElement, Ref } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement;
	},
	ref: Ref<unknown>
) {
	return <Slide direction="left" ref={ref} {...props} />;
});

interface Props {
	readonly open: boolean;
	readonly onClose: () => void;
}

export const CategoryDetailsDialog = (props: Props) => {
	return (
		<Dialog
			fullScreen
			onClose={props.onClose}
			open={props.open}
			TransitionComponent={Transition}
		>
			<AppBar>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={props.onClose}
					>
						<CloseIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<h1>Hello World</h1>
		</Dialog>
	);
};
