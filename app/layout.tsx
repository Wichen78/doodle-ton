// app/layout.tsx

import { FC, ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

import './globals.css';
import { ToastProvider } from '@/contexts/ToastContext';
import { AuthProvider } from '@/providers/AuthProvider';
import { font } from '@/app/utils/consts';

export const metadata: Metadata = {
	title: 'Astro TON',
	description: 'JUMP Jump jump',
	manifest: '/manifest.json',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1.0,
	maximumScale: 1.0,
	userScalable: false,
};

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
	return (
		<html lang="en" className={ font.className }>
		<body>
			<div
				className="w-full bg-gradient-to-b from-blue-500 to-blue-100 text-white h-screen overflow-y-hidden no-scrollbar font-bold">
				<ToastProvider>
					<AuthProvider>{ children }</AuthProvider>
				</ToastProvider>
			</div>
		</body>
		</html>
	);
};

export default RootLayout;
