// Test the server-side firebase module security
const axios = require('axios');

const testingUrl = 'http://localhost:8080/';

async function get(url) {
	return await axios.get(testingUrl + url);
}

async function post(url, data) {
	return await axios.post(testingUrl + url, data);
}

describe('the server', () => {
	// Allow

	it('should allow a get request for the leaderboard', async () => {
		const response = await get('Leaderboard');
		expect(typeof response.data).toBe('object');
	});

	it('should allow a valid post request for the leaderboard', async () => {
		const response = await post('Leaderboard', {
			id: 'test',
			name: 'test',
			score: 0,
			uid: 'test',
		});

		expect(response.status).toBe(200);
	});

	it('should allow a valid post request for the users', async () => {
		const response = await post('user', {
			id: 'test',
			name: 'test',
			score: 0,
			uid: 'test',
		});

		expect(response.status).toBe(200);
	});

	// Reject

	it('should reject a post request to the leaderboard without an id', async () => {
		try {
			await post('Leaderboard', {
				name: 'test',
				score: 0,
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard with an invalid id type', async () => {
		try {
			await post('Leaderboard', {
				name: 'test',
				score: 0,
				id: 0,
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard without a name', async () => {
		try {
			await post('Leaderboard', {
				id: 'test',
				score: 0,
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard with an invalid name type', async () => {
		try {
			await post('Leaderboard', {
				name: 0,
				score: 0,
				id: 'test',
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard without a score', async () => {
		try {
			await post('Leaderboard', {
				id: 'test',
				name: 'test',
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard with an invalid score type', async () => {
		try {
			await post('Leaderboard', {
				name: 'test',
				score: 'test',
				id: 'test',
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard without a uid', async () => {
		try {
			await post('Leaderboard', {
				id: 'test',
				name: 'test',
				score: 0,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard with an invalid uid type', async () => {
		try {
			await post('Leaderboard', {
				name: 'test',
				score: 0,
				id: 'test',
				uid: 0,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the users without an id', async () => {
		try {
			await post('user', {
				name: 'test',
				score: 0,
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the users with an invalid id type', async () => {
		try {
			await post('user', {
				name: 'test',
				score: 0,
				id: 0,
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the users without a name', async () => {
		try {
			await post('user', {
				id: 'test',
				score: 0,
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the users with an invalid name type', async () => {
		try {
			await post('user', {
				name: 0,
				score: 0,
				id: 'test',
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the users without a score', async () => {
		try {
			await post('user', {
				id: 'test',
				name: 'test',
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the users with an invalid score type', async () => {
		try {
			await post('user', {
				name: 'test',
				score: 'test',
				id: 'test',
				uid: 'test',
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the users without a uid', async () => {
		try {
			await post('user', {
				id: 'test',
				name: 'test',
				score: 0,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the users with an invalid uid type', async () => {
		try {
			await post('user', {
				name: 'test',
				score: 'test',
				id: 'test',
				uid: 0,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard with a negative score', async () => {
		try {
			await post('user', {
				id: 'test',
				name: 'test',
				uid: 'test',
				score: -1,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard with an invalid score', async () => {
		try {
			await post('user', {
				id: 'test',
				name: 'test',
				uid: 'test',
				score: 3,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard with a nan score', async () => {
		try {
			await post('user', {
				id: 'test',
				name: 'test',
				uid: 'test',
				score: NaN,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the leaderboard with an infinite score', async () => {
		try {
			await post('user', {
				id: 'test',
				name: 'test',
				uid: 'test',
				score: Infinity,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the total games played without a user name', async () => {
		try {
			await post('TotalGamesPlayed', {
				id: 'test',
				uid: 'test',
				score: 0,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the total games played without a user id', async () => {
		try {
			await post('TotalGamesPlayed', {
				name: 'test',
				uid: 'test',
				score: 0,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the total games played without a user score', async () => {
		try {
			await post('TotalGamesPlayed', {
				name: 'test',
				id: 'test',
				uid: 'test',
				score: 0,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});

	it('should reject a post request to the total games played without a user uid', async () => {
		try {
			await post('TotalGamesPlayed', {
				name: 'test',
				id: 'test',
				score: 0,
			});
		} catch (err) {
			expect(err.response.status).toBe(400);
		}
	});
});
