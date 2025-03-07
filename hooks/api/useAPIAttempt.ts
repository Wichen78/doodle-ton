// hooks/api/useAPIAttempt.ts

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AttemptResponse } from '@/types/api';
import { GET_ATTEMPT, GET_USER } from '@/types/queryKey';
import { CreateAttemptQueryParams, GetAttemptQueryParams } from '@/types/queryParams';
import { useGameStore } from '@/utils/game-mechanics';

const fetchAttemptBest = async (params: GetAttemptQueryParams): Promise<AttemptResponse> => {
	const response = await fetch(`/api/attempt/best?telegramInitData=${ encodeURIComponent(params.telegramInitData) }`);
	return response.json();
};

const createAttempt = async (params: CreateAttemptQueryParams): Promise<AttemptResponse> => {
	const response = await fetch('/api/attempt/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			telegramInitData: params.telegramInitData,
			points: params.score,
			stars: params.starScore,
		}),
	});
	return response.json();
};

export const useAPIAttempt = () => {
	const queryClient = useQueryClient();
	const { userTelegramInitData } = useGameStore();

	const getBest = useQuery({
		queryKey: GET_ATTEMPT.BEST_KEY,
		queryFn: () => fetchAttemptBest({ telegramInitData: userTelegramInitData }),
	});

	const createAttemptMutation = useMutation({
		mutationFn: createAttempt,
		onSuccess: (result) => {
			if (getBest.data?.points && result.points > getBest.data?.points) {
				queryClient.invalidateQueries({ queryKey: GET_ATTEMPT.BEST_KEY });
			}
			if (result.stars > 0) {
				queryClient.invalidateQueries({ queryKey: GET_USER.BALANCE_KEY });
			}
		},
		onError: (error) => {
			console.error('Failed to create attempt', error);
		},
	});

	return { best: getBest, createAttempt: createAttemptMutation };
};
