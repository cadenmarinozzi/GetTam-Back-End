const utils = require('../src/utils');

describe('utils.getRequestIp', () => {
	it('should return the request ip from the headers', () => {
		const requestIp = utils.getRequestIp({
			headers: {
				'x-forwarded-for': 'ip',
			},
		});

		expect(requestIp).toBe('ip');
	});

	it('should return the request ip from the connection', () => {
		const requestIp = utils.getRequestIp({
			headers: {},
			connection: {
				remoteAddress: 'ip',
			},
		});

		expect(requestIp).toBe('ip');
	});
});

describe('utils.verifyUserRequest', () => {
	// Allow
	it('should return true with valid user properties', () => {
		const user = {
			id: 'id',
			name: 'name',
			uid: 'uid',
		};

		expect(utils.verifyUserRequest(user)).toBe(true);
	});

	// Reject
	it('should return false without a user id', () => {
		const user = {
			name: 'name',
			uid: 'uid',
		};

		expect(utils.verifyUserRequest(user)).toBe(false);
	});

	it('should return false without a user name', () => {
		const user = {
			id: 'id',
			uid: 'uid',
		};

		expect(utils.verifyUserRequest(user)).toBe(false);
	});

	it('should return false without a user uid', () => {
		const user = {
			id: 'id',
			name: 'name',
		};

		expect(utils.verifyUserRequest(user)).toBe(false);
	});

	it('should return false with an invalid user id type', () => {
		const user = {
			id: 0,
			name: 'name',
			uid: 'uid',
		};

		expect(utils.verifyUserRequest(user)).toBe(false);
	});

	it('should return false with an invalid user name type', () => {
		const user = {
			id: 'id',
			name: 0,
			uid: 'uid',
		};

		expect(utils.verifyUserRequest(user)).toBe(false);
	});

	it('should return false with an invalid user uid type', () => {
		const user = {
			id: 'id',
			name: 'name',
			uid: 0,
		};

		expect(utils.verifyUserRequest(user)).toBe(false);
	});
});

describe('utils.verifyScore', () => {
	// Allow

	it('should return true with a valid score', () => {
		expect(utils.verifyScore(0)).toBe(true);
		expect(utils.verifyScore(2)).toBe(true);
		expect(utils.verifyScore(4)).toBe(true);
		expect(utils.verifyScore(100)).toBe(true);
		expect(utils.verifyScore(1000)).toBe(true);
	});

	// Reject

	it('should return false with a negative score', () => {
		expect(utils.verifyScore(-1)).toBe(false);
		expect(utils.verifyScore(-100)).toBe(false);
	});

	it('should return false with an invalid score', () => {
		expect(utils.verifyScore(1)).toBe(false);
		expect(utils.verifyScore(13)).toBe(false);
	});

	it('should return false with a NaN score', () => {
		expect(utils.verifyScore(NaN)).toBe(false);
	});

	it('should return false with an infinite score', () => {
		expect(utils.verifyScore(Infinity)).toBe(false);
	});

	it('should return false with an invalid score type', () => {
		expect(utils.verifyScore('score')).toBe(false);
	});

	it('should return false with a huge score', () => {
		expect(utils.verifyScore(99999999999999)).toBe(false);
	});
});

describe('utils.compareUser', () => {
	// Allow
	it('should return true with the same user', () => {
		const user1 = {
			id: 'id',
			name: 'name',
			uid: 'uid',
		};

		const user2 = {
			id: 'id',
			name: 'name',
			uid: 'uid',
		};

		expect(utils.compareUser(user1, user2)).toBe(true);
	});

	it('should return true with the same user but a different score', () => {
		const user1 = {
			id: 'id',
			name: 'name',
			uid: 'uid',
			score: 0,
		};

		const user2 = {
			id: 'id',
			name: 'name',
			uid: 'uid',
			score: 100,
		};

		expect(utils.compareUser(user1, user2)).toBe(true);
	});

	// Reject
	it('should return false with different user ids', () => {
		const user1 = {
			id: 'id1',
			name: 'name',
			uid: 'uid',
		};

		const user2 = {
			id: 'id2',
			name: 'name',
			uid: 'uid',
		};

		expect(utils.compareUser(user1, user2)).toBe(false);
	});

	it('should return false with different user names', () => {
		const user1 = {
			id: 'id',
			name: 'name1',
			uid: 'uid',
		};

		const user2 = {
			id: 'id',
			name: 'name2',
			uid: 'uid',
		};

		expect(utils.compareUser(user1, user2)).toBe(false);
	});

	it('should return false with different user uids', () => {
		const user1 = {
			id: 'id',
			name: 'name',
			uid: 'uid1',
		};

		const user2 = {
			id: 'id',
			name: 'name',
		};

		expect(utils.compareUser(user1, user2, 'uid2')).toBe(false);
	});
});

describe('utils.getDate', () => {
	it('should return a correctly formatted date', () => {
		const date = utils.getDate();

		expect(date.match(/(\d-(\d)+)|(\1-testing)/g).length).toBe(1);
	});
});
