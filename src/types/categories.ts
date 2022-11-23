import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';

export interface CategoryDetails {
	readonly isNew: boolean;
	readonly id?: string;
	readonly name: string;
}

export type CategoryOption = SelectOption<string>;
