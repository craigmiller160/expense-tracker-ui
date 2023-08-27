import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';

export type AutoCategorizeRulePageRequest = {
	readonly pageNumber: number;
	readonly pageSize: number;
	readonly categoryId?: string;
	readonly regex?: string;
};

export type OrdinalOption = SelectOption<number>;
