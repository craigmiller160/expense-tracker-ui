import {OptionT} from '@craigmiller160/ts-functions/es/types';

type Props = {
	readonly open: boolean;
	readonly close: () => void;
	readonly selectedRuleId: OptionT<string>;
};

export const RuleDetailsDialog = (props: Props) => <div />;
