import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { useHandleDialogData } from './useHandleDialogData';
import { SideDialog } from '../../UI/SideDialog';
import { CircularProgress } from '@mui/material';

type Props = {
	readonly open: boolean;
	readonly close: () => void;
	readonly selectedRuleId: OptionT<string>;
};

// TODO how to add ordinal control?
export const RuleDetailsDialog = (props: Props) => {
	const { isFetching } = useHandleDialogData({
		selectedRuleId: props.selectedRuleId
	});
	return (
		<SideDialog
			title="Rule Details"
			open={props.open}
			onClose={props.close}
		>
			{isFetching && <CircularProgress />}
		</SideDialog>
	);
};
