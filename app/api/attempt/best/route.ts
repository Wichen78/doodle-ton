// app/api/attempt/best/route.ts

import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';

export async function GET(req: Request) {
	const url = new URL(req.url);
	const telegramInitData = url.searchParams.get('telegramInitData');

	if (!telegramInitData) {
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}

	const { validatedData, user: telegramUser } = validateTelegramWebAppData(telegramInitData);

	if (!validatedData) {
		return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 403 });
	}

	const telegramId = process.env.NEXT_PUBLIC_BYPASS_TELEGRAM_AUTH ? process.env.USER_TEST : telegramUser.id?.toString();

	if (!telegramId) {
		return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
	}

	try {
		// Find the user
		const dbUser = await prisma.user.findUnique({
			where: { telegramId },
		});

		if (!dbUser) {
			throw new Error('User not found');
		}

		const best = await prisma.attempt.findFirst({
			where: { authorId: dbUser.id },
			orderBy: { points: 'desc' },
		});

		return NextResponse.json(best);
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				console.log('User already exists:', error);
				return NextResponse.json({ error: 'User already exists' }, { status: 409 });
			}
		}
		console.error('Error fetching best attempt:', error);
		return NextResponse.json({ error: 'Failed to fetch best attempt' }, { status: 500 });
	}
}
