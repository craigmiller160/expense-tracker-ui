import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { useHandleRuleDialogData } from './useHandleRuleDialogData';
import { SideDialog } from '../../UI/SideDialog';
import { CircularProgress } from '@mui/material';

type Props = {
	readonly open: boolean;
	readonly close: () => void;
	readonly selectedRuleId: OptionT<string>;
};

// TODO how to add ordinal control?
export const RuleDetailsDialog = (props: Props) => {
	const { isFetching } = useHandleRuleDialogData({
		selectedRuleId: props.selectedRuleId
	});
	return (
		<SideDialog
			title="Rule Details"
			open={props.open}
			onClose={props.close}
		>
			{isFetching && <CircularProgress />}
			{!isFetching && <div></div>}
		</SideDialog>
	);
};
