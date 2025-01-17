// hooks/useDeviceOrientation.tsx

'use client';

import { useCallback, useEffect, useState } from 'react';
import { DeviceOrientationData, DeviceOrientationEventIOS } from '@/types';

export const useDeviceOrientation = (): DeviceOrientationData => {
	const [error, setError] = useState<Error | null>(null);
	const [orientation, setOrientation] = useState<DeviceOrientationEvent | null>(null);

	const onDeviceOrientation = (event: DeviceOrientationEvent): void => {
		setOrientation({
			...event,
			absolute: event.absolute,
			alpha: event.alpha,
			beta: event.beta,
			gamma: event.gamma,
		});
	};

	const requestAccessAsync = async (): Promise<boolean> => {
		if (typeof DeviceOrientationEvent === 'undefined') {
			setError(new Error('Device orientation event is not supported by your browser'));
			return false;
		}

		const requestPermission = (DeviceOrientationEvent as unknown as DeviceOrientationEventIOS).requestPermission;
		const iOS = typeof requestPermission === 'function';

		if (iOS) {
			try {
				const permission = await requestPermission();
				if (permission !== 'granted') {
					setError(new Error('Request to access the device orientation was rejected'));
					return false;
				}
			} catch (err) {
				console.error(err);
				setError(new Error('Failed to request device orientation permission'));
				return false;
			}
		}

		window.addEventListener('deviceorientation', onDeviceOrientation);
		return true;
	};

	const revokeAccessAsync = async (): Promise<void> => {
		window.removeEventListener('deviceorientation', onDeviceOrientation);
		setOrientation(null);
	};

	const requestAccess = useCallback(requestAccessAsync, []);
	const revokeAccess = useCallback(revokeAccessAsync, []);

	useEffect(() => {
		return (): void => {
			revokeAccess();
		};
	}, [revokeAccess]);

	return {
		orientation,
		error,
		requestAccess,
		revokeAccess,
	};
};
