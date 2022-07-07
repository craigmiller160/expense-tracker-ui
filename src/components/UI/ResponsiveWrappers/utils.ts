import { Theme } from '@mui/material';

export interface WrapperOuterProps {
	readonly className?: string;
	readonly 'data-testid'?: string;
}

export interface InnerDivProps {
	readonly theme: Theme;
	readonly className?: string;
	readonly 'data-testid'?: string;
}
