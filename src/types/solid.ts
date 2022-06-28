export type EventHandler<T, E extends Event> = (
	e: E & {
		currentTarget: T;
		target: Element;
	}
) => void;
