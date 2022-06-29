import {
	AppBar,
	Box,
	Dialog,
	IconButton,
	Slide,
	Toolbar,
	Typography
} from '@mui/material';
import { forwardRef, ReactElement, Ref } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import * as Option from 'fp-ts/es6/Option';
import { CategoryDetails } from '../../../types/categories';
import { pipe } from 'fp-ts/es6/function';
import './CategoryDetailsDialog.scss';

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: ReactElement;
	},
	ref: Ref<unknown>
) {
	return <Slide direction="left" ref={ref} {...props} />;
});

interface Props {
	readonly selectedCategory: OptionT<CategoryDetails>;
	readonly onClose: () => void;
}

const getTitle = (selectedCategory: OptionT<CategoryDetails>): string =>
	pipe(
		selectedCategory,
		Option.map((category) =>
			category.isNew ? 'New Category' : category.name
		),
		Option.getOrElse(() => '')
	);

export const CategoryDetailsDialog = (props: Props) => {
	const title = getTitle(props.selectedCategory);
	return (
		<Dialog
			fullScreen
			onClose={props.onClose}
			open={Option.isSome(props.selectedCategory)}
			TransitionComponent={Transition}
			className="CategoryDetailsDialog"
		>
			<AppBar sx={{ position: 'relative' }}>
				<Toolbar>
					<Typography variant="h6">{title}</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<IconButton
						edge="start"
						color="inherit"
						onClick={props.onClose}
					>
						<CloseIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<h1>Hello World</h1>
		</Dialog>
	);
};
