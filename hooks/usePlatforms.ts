// hooks/usePlatform.ts

'use client';

import { useEffect, useRef } from 'react';
import { useGame } from '@/hooks/useGame';
import { BLACK_HOLE, ElementType, GameDifficulty, JET_PACK, MONSTER, PLATFORM, STAR } from '@/utils/consts';
import { drawElement, getNextElementType, isColliding, loadImage, random } from '@/utils/playerUtils';
import { DoodlePlayer, Platform, PlatformOption } from '@/types';

/**
 * Custom hook `usePlatforms` to manage game platform logic, including initialization, updating,
 * and handling dynamic elements like platforms, monsters, stars, and jetpacks within the game.
 *
 * It provides several utilities:
 * - Initializing the game platforms at the start or reset.
 * - Adding new elements dynamically as the player progresses through the game.
 * - Updating elements, managing collisions, movements, and scoring.
 *
 * @return {Object} An object containing the following methods:
 * - `initializePlatforms`: Initializes the starting platforms and sets their positions based on canvas size.
 * - `addNewElements`: Dynamically adds new elements (platforms, stars, monsters, jetpacks) to the game as the player moves upward.
 * - `updateElements`: Handles rendering and updating of elements, including collision detection, removing invisible elements,
 *   and updating scores and gameplay dynamics.
 */
export const usePlatforms = () => {
	const { score, increaseStarScore, increaseScore } = useGame();
	const scoreRef = useRef(score);

	const images = useRef<Record<string, HTMLImageElement | null>>({
		monsterRight: null,
		monsterLeft: null,
		star: null,
		jetpack: null,
	});

	// Load images
	useEffect(() => {
		if (typeof window !== 'undefined') {
			images.current = {
				monsterRight: loadImage('monsters/default/right.svg'),
				monsterLeft: loadImage('monsters/default/left.svg'),
				star: loadImage('star.svg'),
				jetpack: loadImage('jetpack/default.svg'),
			};
		}
	}, []);

	useEffect(() => {
		scoreRef.current = score;
	}, [score]);

	const initializePlatforms = (canvas: HTMLCanvasElement) => {
		const platforms: Platform[] = [{
			x: canvas.width / 2 - PLATFORM.width / 2,
			y: canvas.height - 50,
			type: ElementType.PLATFORM,
			options: { direction: true }
		}];

		for (let y = platforms[0].y - (PLATFORM.height + random(PLATFORM.minSpace, PLATFORM.maxSpace));
				 y > 0;
				 y -= PLATFORM.height + random(PLATFORM.minSpace, PLATFORM.maxSpace)) {
			platforms.push({
				x: random(25, canvas.width - 25 - PLATFORM.width),
				y,
				type: ElementType.PLATFORM,
				options: { direction: true }
			});
		}

		platforms.push({
			x: platforms[platforms.length - 1].x + PLATFORM.width / 2 - JET_PACK.width / 2,
			y: platforms[platforms.length - 1].y - JET_PACK.height - JET_PACK.minSpace,
			type: ElementType.JET_PACK,
			options: { direction: true }
		});

		return platforms;
	};

	const addNewElements = (
		canvas: HTMLCanvasElement,
		doodle: DoodlePlayer,
		platforms: Platform[]
	) => {
		let y = platforms[platforms.length - 1].y;

		while (y > 0) {
			const type = doodle.jetpack ? ElementType.PLATFORM : getNextElementType(platforms, scoreRef.current);

			const widthMap = {
				[ElementType.STAR]: STAR.width,
				[ElementType.MONSTER]: MONSTER.width,
				[ElementType.PLATFORM]: PLATFORM.width,
				[ElementType.BLACK_HOLE]: BLACK_HOLE.width,
				[ElementType.JET_PACK]: JET_PACK.width,
			};

			const x = type === ElementType.STAR
				? platforms[platforms.length - 1].x + PLATFORM.width / 2 - STAR.width / 2
				: type === ElementType.MONSTER
					? platforms[platforms.length - 1].x + PLATFORM.width / 2 - MONSTER.width / 2
					: type === ElementType.JET_PACK
						? platforms[platforms.length - 1].x + PLATFORM.width / 2 - JET_PACK.width / 2
						: random(25, canvas.width - 25 - widthMap[type]);

			const heightMap = {
				[ElementType.STAR]: STAR.height + STAR.minSpace,
				[ElementType.MONSTER]: MONSTER.height + MONSTER.minSpace,
				[ElementType.PLATFORM]: PLATFORM.height + random(PLATFORM.minSpace, PLATFORM.maxSpace),
				[ElementType.BLACK_HOLE]: BLACK_HOLE.height + BLACK_HOLE.minSpace,
				[ElementType.JET_PACK]: JET_PACK.height + JET_PACK.minSpace,
			};

			const options = type === ElementType.MONSTER ? {
				direction: true,
				alive: true,
				gapX: 0,
				gapY: 0
			} : { direction: true };

			y -= heightMap[type];
			platforms.push({ x, y, type, options });
		}

		return platforms;
	};
	const updateElements = (
		context: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement,
		elements: Platform[],
		doodle: DoodlePlayer,
		prevDoodleY: number,
		platformImage: HTMLImageElement | null,
	) => {
		const newElements = [];

		if (doodle.jetpack && doodle.jetpackLimit < scoreRef.current) {
			doodle.jetpack = false;
			doodle.jetpackLimit = 0;
		}

		for (const element of elements) {
			const monsterImage = element.options.direction ? images.current.monsterRight : images.current.monsterLeft;
			drawElement(context, element, platformImage, images.current.star, monsterImage, images.current.jetpack);

			if (doodle.drawOnly) {
				newElements.push(element);
				continue;
			}

			// Gestion des collisions
			if (element.type === ElementType.STAR && isColliding(doodle, element, STAR)) {
				increaseStarScore(1);
				continue; // Ne pas ajouter l'étoile collectée
			}

			if (element.type === ElementType.JET_PACK && isColliding(doodle, element, JET_PACK)) {
				doodle.jetpack = true;
				doodle.jetpackLimit = scoreRef.current + 35;
				continue; // Ne pas ajouter le jetpack collectée
			}

			if (element.type === ElementType.MONSTER) {
				if (isColliding(doodle, element, MONSTER)) {
					if (doodle.dy > 0 && prevDoodleY + doodle.height <= element.y) {
						element.options.alive = false;
						doodle.y = element.y - doodle.height;
						doodle.dy = GameDifficulty.BOUNCE_VELOCITY;
						increaseStarScore(1);
					} else {
						doodle.dy = 0;
						doodle.drawOnly = true;
					}
				}
				handleMonsterMovement(element);
			}

			if (
				element.type === ElementType.PLATFORM &&
				doodle.dy > 0 &&
				prevDoodleY + doodle.height <= element.y &&
				isColliding(doodle, element, PLATFORM)
			) {
				doodle.y = element.y - doodle.height;
				doodle.dy = GameDifficulty.BOUNCE_VELOCITY;
			}

			newElements.push(element);
		}

		elements = newElements;

		const visibleElements = elements.filter(e => e.y < canvas.height);
		const elementsDisappeared = elements.length - visibleElements.length;
		if (elementsDisappeared > 0) {
			const prevStars = Math.floor(scoreRef.current / 150);
			const newStars = Math.floor((scoreRef.current + elementsDisappeared) / 150);
			increaseScore(elementsDisappeared);

			if (newStars > prevStars) {
				increaseStarScore(newStars - prevStars);
			}
		}

		return visibleElements;
	};

	const handleMonsterMovement = (element: { options: PlatformOption }) => {
		element.options.gapX = element.options.gapX || 0;
		element.options.gapY = element.options.gapY || 0;
		element.options.alive = element.options.alive || false;
		const maxGap = PLATFORM.width / 2;

		if (!element.options.alive) {
			element.options.gapY += 16;
			return;
		}

		if (element.options.direction) {
			if (element.options.gapX < maxGap) {
				element.options.gapX += 1;
			} else {
				element.options.direction = false;
			}
		} else {
			if (-element.options.gapX < maxGap) {
				element.options.gapX -= 1;
			} else {
				element.options.direction = true;
			}
		}
	};

	return { initializePlatforms, addNewElements, updateElements };
};
