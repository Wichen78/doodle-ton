// hooks/useDeviceOrientation.tsx

'use client';

import { useCallback, useEffect, useState } from 'react';
import { DeviceOrientationData, DeviceOrientationEventIOS } from '@/types';

export const useDeviceOrientation = (): DeviceOrientationData => {
	const [permission, setPermission] = useState<boolean>(false);
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
					setPermission(false);
					setError(new Error('Request to access the device orientation was rejected'));
					return false;
				} else {
					setPermission(true);
				}
			} catch (err) {
				console.error(err);
				setPermission(false);
				setError(new Error('Failed to request device orientation permission'));
				return false;
			}
		} else {
			setPermission(true);
		}

		window.addEventListener('deviceorientation', onDeviceOrientation);
		return true;
	};

	const revokeAccessAsync = async (): Promise<void> => {
		window.removeEventListener('deviceorientation', onDeviceOrientation);
		setPermission(false);
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
		permission,
		orientation,
		error,
		requestAccess,
		revokeAccess,
	};
};
