// app/api/user/route.ts

import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';

import { prisma } from '@/utils/prisma';
import { validateTelegramWebAppData } from '@/utils/server-checks';

export async function POST(req: Request) {
	const body = await req.json();
	const { telegramInitData } = body;

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
		let dbUser = await prisma.user.findUnique({
			where: { telegramId },
		});

		if (dbUser) {
			dbUser = await prisma.user.update({
				where: {
					telegramId,
				},
				data: {
					telegramId,
					name: telegramUser?.first_name || '',
					pointsBalance: dbUser.pointsBalance ?? 0,
					starsBalance: dbUser.starsBalance ?? 0,
				},
			});
		} else {
			// New user creation
			dbUser = await prisma.user.create({
				data: {
					telegramId,
					name: telegramUser?.first_name || '',
					pointsBalance: 0,
					starsBalance: 0,
				},
			});
		}

		return NextResponse.json(dbUser);
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				console.log('User already exists:', error);
				return NextResponse.json({ error: 'User already exists' }, { status: 409 });
			}
		}
		console.error('Error fetching/creating user:', error);
		return NextResponse.json({ error: 'Failed to fetch/create user' }, { status: 500 });
	}
}
