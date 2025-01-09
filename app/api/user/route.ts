// app/api/user/route.ts

import { NextResponse } from 'next/server';

//const MAX_RETRIES = 3;
//const RETRY_DELAY = 100; // milliseconds

export async function POST(req: Request) {
	const body = await req.json();
	const { telegramInitData } = body;

	if (!telegramInitData) {
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}

	return NextResponse.json({ points: 5000 });
}
