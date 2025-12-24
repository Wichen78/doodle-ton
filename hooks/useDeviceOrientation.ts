// hooks/useDeviceOrientation.tsx

'use client';

import { useCallback, useEffect, useState } from 'react';
import { DeviceOrientationData, DeviceOrientationEventIOS } from '@/types';

/**
 * A custom hook that provides access to device orientation data.
 *
 * @returns {DeviceOrientationData} An object containing the current orientation data of the device,
 * any error that occurred during access, and functions to request or revoke access to device orientation events.
 *
 * The returned object includes the following properties:
 * - `orientation`: The latest device orientation event data, or null if not available.
 * - `error`: An error object if an issue occurred while requesting device orientation access, or null otherwise.
 * - `requestAccess`: A callback function to request access to the device's orientation data. If the device requires
 *   user permission (like on iOS), this function will handle the permission request. Returns a Promise that resolves
 *   to a boolean indicating whether access was successfully granted.
 * - `revokeAccess`: A callback function to stop listening for device orientation changes and reset the orientation data.
 */
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
