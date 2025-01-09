// app/layout.tsx

import React from 'react';
import './globals.css';
import { ToastProvider } from '@/contexts/ToastContext';
import { geist } from '@/app/utils/consts.ts';

export default function RootLayout({ children, }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={ geist.className }>
		<body>
			<ToastProvider>
				<main>{ children }</main>
			</ToastProvider>
		</body>
		</html>
	);
}
