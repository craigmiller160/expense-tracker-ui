import { screen, waitFor } from '@testing-library/react';
import * as RArray from 'fp-ts/ReadonlyArray';
import { constVoid, pipe } from 'fp-ts/function';
import { MonoidT, TaskTryT, TryT } from '@craigmiller160/ts-functions/es/types';
import * as Monoid from 'fp-ts/Monoid';
import * as Either from 'fp-ts/Either';
import * as TaskEither from 'fp-ts/TaskEither';
import * as TaskTry from '@craigmiller160/ts-functions/es/TaskTry';
import * as Try from '@craigmiller160/ts-functions/es/Try';

export type Item = {
	readonly text: string;
	readonly occurs?: number;
	readonly timeout?: number;
};

const waitForTaskMonoid: MonoidT<TaskTryT<ReadonlyArray<HTMLElement>>> = {
	empty: () => Promise.resolve(Either.right([])),
	concat: (task1, task2) =>
		pipe(
			task1,
			TaskEither.bindTo('task1'),
			TaskEither.bind('task2', () => task2),
			TaskEither.map(({ task1, task2 }) => [task1, task2].flat())
		)
};

const visibilityTestMonoid: MonoidT<TryT<void>> = {
	empty: Either.right(constVoid()),
	concat: (try1, try2) =>
		pipe(
			try1,
			Either.chain(() => try2)
		)
};

const waitForItem = (item: Item): TaskTryT<ReadonlyArray<HTMLElement>> =>
	TaskTry.tryCatch(() =>
		waitFor(
			() => {
				const items = screen.queryAllByText(item.text);
				expect(items).toHaveLength(item.occurs ?? 1);
				return items;
			},
			{
				timeout: item.timeout ?? 3000
			}
		)
	);

const checkVisibility = (element: HTMLElement): TryT<void> =>
	Try.tryCatch(() => expect(element).toBeVisible());

const checkVisibilityForAllElements = (
	elements: ReadonlyArray<HTMLElement>
): TryT<void> =>
	pipe(
		elements,
		RArray.map(checkVisibility),
		Monoid.concatAll(visibilityTestMonoid)
	);

export const waitForVisibility = async (
	allItems: ReadonlyArray<Item>
): Promise<void> => {
	const taskResult = await pipe(
		allItems,
		RArray.map(waitForItem),
		Monoid.concatAll(waitForTaskMonoid),
		TaskEither.chainEitherK(checkVisibilityForAllElements)
	)();

	Either.mapLeft((ex) => {
		throw ex;
	})(taskResult);
};
