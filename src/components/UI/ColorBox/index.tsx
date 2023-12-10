import './ColorBox.scss';

type Props = {
	readonly color: string;
};

export const ColorBox = (props: Props) => (
	<div className="color-box" style={{ backgroundColor: props.color }} />
);
