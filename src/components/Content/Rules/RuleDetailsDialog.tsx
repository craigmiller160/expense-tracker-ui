import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { useHandleRuleDialogData } from './useHandleRuleDialogData';
import { SideDialog } from '../../UI/SideDialog';
import { CircularProgress } from '@mui/material';
import './RuleDetailsDialog.scss';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';

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
			{!isFetching && (
				<div className="AutoCategorizeRuleDetailsForm">
					<ResponsiveRow>
						<p>Ordinal</p>
						<p>Category</p>
					</ResponsiveRow>
					<ResponsiveRow>
						<p>Regex</p>
					</ResponsiveRow>
					<ResponsiveRow>
						<p>Start Date</p>
						<p>End Date</p>
					</ResponsiveRow>
					<ResponsiveRow>
						<p>Min Amount</p>
						<p>Max Amount</p>
					</ResponsiveRow>
				</div>
			)}
		</SideDialog>
	);
};
