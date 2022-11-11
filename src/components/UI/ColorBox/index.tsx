import './ColorBox.scss';

type Props = {
	readonly color: string;
};

export const ColorBox = (props: Props) => (
	<div className="ColorBox" style={{ backgroundColor: props.color }} />
);
