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
import { ResponsiveSlideDialogWrapper } from './ResponsiveSlideDialogWrapper';

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement;
	},
	ref: Ref<unknown>
) {
	return <Slide direction="left" ref={ref} {...props} />;
});

interface Props {
	readonly id?: string;
	readonly title: string;
	readonly open: boolean;
	readonly onClose: () => void;
	readonly actions?: ReactNode;
	readonly formSubmit?: () => void;
	readonly 'data-testid'?: string;
}

interface FormProps {
	readonly formSubmit?: () => void;
}

const DialogForm = ({ formSubmit, children }: PropsWithChildren<FormProps>) => (
	<form className="dialog-form" onSubmit={formSubmit}>
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
			PaperComponent={ResponsiveSlideDialogWrapper}
			className="slide-dialog"
			data-testid={props['data-testid']}
		>
			<Form formSubmit={props.formSubmit}>
				<AppBar sx={{ position: 'relative' }} id={`${props.id}-header`}>
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
				<DialogContent id={`${props.id}-body`} className="body">
					{props.children}
				</DialogContent>
				<DialogActions id={`${props.id}-footer`}>
					{props.actions}
				</DialogActions>
			</Form>
		</Dialog>
	);
};
