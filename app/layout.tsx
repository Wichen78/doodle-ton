// app/layout.tsx

import { FC } from 'react';
import './globals.css';
import { ToastProvider } from '@/contexts/ToastContext';
import { font } from '@/app/utils/consts';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
	title: 'Astro TON',
	description: 'JUMP Jump jump',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1.0,
	maximumScale: 1.0,
	userScalable: false,
};

const RootLayout: FC<{ children: React.ReactNode }> = ({ children, }) => {
	return (
		<html lang="en" className={ font.className }>
		<body>
			<ToastProvider>
				<main>{ children }</main>
			</ToastProvider>
		</body>
		</html>
	);
};

export default RootLayout;
