const utils = {};

/**
 * Returns the IP address from the request headers.
 *
 * @param {object} req - The request object.
 * @returns {string} The IP address.
 */
utils.getRequestIp = (req) => {
	return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

/**
 * @param {object} user - The user object
 * @return {boolean} If user object has valid id and name properties
 */
utils.verifyUserRequest = (user) => {
	return user &&
		user.id &&
		typeof user.id === 'string' &&
		user.name &&
		typeof user.name === 'string' &&
		user.uid &&
		typeof user.uid === 'string'
		? true
		: false;
};

const MAX_TILE = 131072;
const NUM_TILES = 16;

/**
 * @fileoverview Function to check if the score is valid
 * @param {number} score - score to check
 */
utils.verifyScore = (score) => {
	return score !== null &&
		score !== undefined &&
		typeof score === 'number' &&
		score >= 0 &&
		!isNaN(score) &&
		isFinite(score) &&
		score <= MAX_TILE * NUM_TILES &&
		score % 1 === 0 &&
		score % 2 === 0
		? true
		: false;
};

/**
 * @param {Object} user
 * @param {Object} otherUser
 * @param {string} uid
 */
utils.compareUser = (user, otherUser, uid) => {
	return (uid ? uid === user.uid : true) &&
		otherUser.id === user.id &&
		otherUser.name === user.name
		? true
		: false;
};

/**
 * Gets the current date string
 * @returns {string} A date in the format of mm-dd
 */
utils.getDate = () => {
	const date = new Date();
	const day = date.getDate().toString();
	const month = date.getMonth().toString();

	return `${month}-${day}`;
};

module.exports = utils;
