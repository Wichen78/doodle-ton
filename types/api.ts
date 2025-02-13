export interface AttemptResponse {
	createdAt: Date,
	authorId: string,
	points: number,
}

export interface UserResponse {
	telegramId: string;
	name: string;
	pointsBalance: number;
}
