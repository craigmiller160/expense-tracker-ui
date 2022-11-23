import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { useHandleDialogData } from './useHandleDialogData';

type Props = {
	readonly open: boolean;
	readonly close: () => void;
	readonly selectedRuleId: OptionT<string>;
};

// TODO how to add ordinal control?
export const RuleDetailsDialog = (props: Props) => {
	useHandleDialogData({
		selectedRuleId: props.selectedRuleId
	});
	return <div />;
};
