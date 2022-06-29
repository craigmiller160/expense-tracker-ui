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
	return (
		<Dialog open={dialogContext.open} onClose={dialogContext.onClose}>
			<DialogTitle>{dialogContext.title}</DialogTitle>
			<DialogContent>{dialogContext.message}</DialogContent>
			<DialogActions>
				<Button>Cancel</Button>
				<Button>Confirm</Button>
			</DialogActions>
		</Dialog>
	);
};
