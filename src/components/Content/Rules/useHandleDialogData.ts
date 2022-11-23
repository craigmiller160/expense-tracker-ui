import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { CategoryOption } from '../Transactions/utils';

type Props = {
	readonly selectedRuleId: OptionT<string>;
};

type Data = {
	readonly categories: ReadonlyArray<CategoryOption>;
};

export const useHandleDialogData = (props: Props): Data => {};
