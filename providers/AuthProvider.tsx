// providers/AuthProvider.tsx

'use client';

import { FC, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { UserProvider } from '@/providers/UserProvider';

const queryClient = new QueryClient();

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<QueryClientProvider client={ queryClient }>
			<UserProvider>
				{ children }
			</UserProvider>
		</QueryClientProvider>
	);
};
