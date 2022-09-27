import { useContext } from 'react';
import { ConfirmDialogContext } from './ConfirmDialogProvider';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle
} from '@mui/material';

export const ConfirmDialog = () => {
	const dialogContext = useContext(ConfirmDialogContext);

	const doConfirm = () => {
		dialogContext.onConfirmAction();
		dialogContext.onClose();
	};

	return (
		<Dialog
			data-testid="confirm-dialog"
			open={dialogContext.open}
			onClose={dialogContext.onClose}
		>
			<DialogTitle>{dialogContext.title}</DialogTitle>
			<DialogContent>{dialogContext.message}</DialogContent>
			<DialogActions>
				<Button onClick={dialogContext.onClose}>Cancel</Button>
				<Button onClick={doConfirm}>Confirm</Button>
			</DialogActions>
		</Dialog>
	);
};
