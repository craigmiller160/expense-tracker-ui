import {
	AppBar,
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	IconButton,
	Slide,
	Toolbar,
	Typography
} from '@mui/material';
import {
	forwardRef,
	PropsWithChildren,
	ReactElement,
	ReactNode,
	Ref
} from 'react';
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
	readonly actions?: ReactNode;
	readonly formSubmit?: () => void;
}

interface FormProps {
	readonly formSubmit?: () => void;
}

const DialogForm = ({ formSubmit, children }: PropsWithChildren<FormProps>) => (
	<form className="DialogForm" onSubmit={formSubmit}>
		{children}
	</form>
);

const NoForm = (props: PropsWithChildren<FormProps>) => (
	<div className="DialogForm">{props.children}</div>
);

export const SideDialog = (props: PropsWithChildren<Props>) => {
	const Form = props.formSubmit ? DialogForm : NoForm;
	return (
		<Dialog
			fullScreen
			onClose={props.onClose}
			open={props.open}
			TransitionComponent={Transition}
			className="SideDialog"
		>
			<Form formSubmit={props.formSubmit}>
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
				<DialogContent className="Body">{props.children}</DialogContent>
				<DialogActions>{props.actions}</DialogActions>
			</Form>
		</Dialog>
	);
};
