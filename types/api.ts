export interface AttemptCreateResponse {
	best: { points: number },
	current: AttemptResponse

}

export interface AttemptResponse {
	id: string,
	createdAt: Date,
	updatedAt: Date,
	authorId: string,
	points: number,
}

export interface UserResponse {
	telegramId: string;
	name: string;
	pointsBalance: number;
}
