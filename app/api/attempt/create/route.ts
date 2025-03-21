// app/api/attempt/create/route.ts

import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';

export async function POST(req: Request) {
	const body = await req.json();
	const { telegramInitData, points, stars } = body;

	if (!telegramInitData || isNaN(Number(points)) || isNaN(Number(stars))) {
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}

	const { validatedData, user: telegramUser } = validateTelegramWebAppData(telegramInitData);

	if (!validatedData) {
		return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 403 });
	}

	const telegramId = process.env.NEXT_PUBLIC_BYPASS_TELEGRAM_AUTH === 'true' ? process.env.USER_TEST : telegramUser.id?.toString();

	if (!telegramId) {
		return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
	}

	try {
		const result = await prisma.$transaction(async (prisma) => {
			// Find the user
			const dbUser = await prisma.user.findUnique({
				where: { telegramId },
			});

			if (!dbUser) {
				throw new Error('User not found');
			}

			// Create a new attempt entry
			const attempt = await prisma.attempt.create({
				data: {
					points: points,
					stars: stars,
					authorId: dbUser.id,
				}
			});

			// Add points to user's balance
			await prisma.user.update({
				where: { id: dbUser.id },
				data: {
					pointsBalance: { increment: points },
					starsBalance: { increment: stars },
				},
			});

			return attempt;
		});

		return NextResponse.json(result);
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				console.log('User already exists:', error);
				return NextResponse.json({ error: 'User already exists' }, { status: 409 });
			}
		}
		console.error('Error fetching/creating attempt:', error);
		return NextResponse.json({ error: 'Failed to fetch/create attempt' }, { status: 500 });
	}
}
