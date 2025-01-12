// components/DoodleJump.tsx

'use client';

import React, { useEffect, useRef } from 'react';
import Toggle from '@/components/DoodleJump/Toggle.tsx';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation.tsx';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const DoodleJump: React.FC = () => {
	const { permission, orientation, requestAccess, revokeAccess } = useDeviceOrientation();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const playerDir = useRef(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			console.log('Canvas not loaded');
			return;
		}
		const context = canvas.getContext('2d');
		if (!context) {
			console.log('Context not loaded');
			return;
		}

		// Constants
		const platformWidth = 65;
		const platformHeight = 20;
		const platformStart = canvas.height - 50;
		const gravity = 0.33;
		const bounceVelocity = -12.5;

		// State
		let minPlatformSpace = 15;
		let maxPlatformSpace = 20;
		let platforms = [
			{
				x: canvas.width / 2 - platformWidth / 2,
				y: platformStart,
			},
		];

		let y = platformStart;
		while (y > 0) {
			y -= platformHeight + random(minPlatformSpace, maxPlatformSpace);
			let x;
			do {
				x = random(25, canvas.width - 25 - platformWidth);
			} while (
				y > canvas.height / 2 &&
				x > canvas.width / 2 - platformWidth * 1.5 &&
				x < canvas.width / 2 + platformWidth / 2
				);

			platforms.push({ x, y });
		}

		const doodle = {
			width: 40,
			height: 60,
			x: canvas.width / 2 - 20,
			y: platformStart - 60,
			dx: 0,
			dy: 0,
		};

		let prevDoodleY = doodle.y;


		const loop = () => {
			requestAnimationFrame(loop);
			context.clearRect(0, 0, canvas.width, canvas.height);

			doodle.dy += gravity;

			if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
				platforms.forEach((platform) => {
					platform.y += -doodle.dy;
				});

				while (platforms[platforms.length - 1].y > 0) {
					platforms.push({
						x: random(25, canvas.width - 25 - platformWidth),
						y: platforms[platforms.length - 1].y - (platformHeight + random(minPlatformSpace, maxPlatformSpace)),
					});
					minPlatformSpace += 0.5;
					maxPlatformSpace = Math.min(maxPlatformSpace + 0.5, canvas.height / 2);
				}
			} else {
				doodle.y += doodle.dy;
			}

			if (playerDir.current < 0) {
				doodle.dx = -3;
			} else if (playerDir.current > 0) {
				doodle.dx = 3;
			} else {
				doodle.dx *= 0.9; // Gradually stop movement
			}

			doodle.x += doodle.dx;

			if (doodle.x + doodle.width < 0) doodle.x = canvas.width;
			else if (doodle.x > canvas.width) doodle.x = -doodle.width;

			context.fillStyle = 'green';
			platforms.forEach((platform) => {
				context.fillRect(platform.x, platform.y, platformWidth, platformHeight);

				if (
					doodle.dy > 0 &&
					prevDoodleY + doodle.height <= platform.y &&
					doodle.x < platform.x + platformWidth &&
					doodle.x + doodle.width > platform.x &&
					doodle.y < platform.y + platformHeight &&
					doodle.y + doodle.height > platform.y
				) {
					doodle.y = platform.y - doodle.height;
					doodle.dy = bounceVelocity;
				}
			});

			// display player
			context.fillStyle = 'yellow';
			context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);

			prevDoodleY = doodle.y;

			platforms = platforms.filter((platform) => platform.y < canvas.height);
		};
		requestAnimationFrame(loop);
	}, []);

	useEffect(() => {
		const gamma = orientation && orientation.gamma ? orientation.gamma : 0; // Tilt left/right
		if (gamma < -10) {
			playerDir.current = -1;
		} else if (gamma > 10) {
			playerDir.current = 1;
		} else {
			playerDir.current = 0;
		}
	}, [orientation]);

	const onToggle = (toggleState: boolean): void => {
		if (toggleState) {
			requestAccess();
		} else {
			revokeAccess();
		}
	};

	return (
		<>
			<Toggle isChecked={ permission } onToggle={ onToggle } />
			{ orientation && (orientation.gamma) }
			<canvas ref={ canvasRef } width={ 375 } height={ 600 } style={ { border: '1px solid black' } } />
		</>
	);
};

export default DoodleJump;
