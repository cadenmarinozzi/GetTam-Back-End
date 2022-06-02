const { initializeApp } = require('firebase/app');
const {
	getDatabase,
	ref,
	set,
	get,
	child,
	update,
} = require('firebase/database');
const utils = require('../utils');

require('dotenv').config();

const firebase = {};

/**
 * Initializes the firebase connection.
 * @param {boolean} testing - Whether or not to use the testing Firebase configuration
 */
firebase.init = (testing) => {
	// Load the config from the .env file
	if (testing) {
		firebase.config = {
			apiKey: process.env.TESTING_FIREBASE_API_KEY,
			authDomain: process.env.TESTING_FIREBASE_AUTH_DOMAIN,
			databaseURL: process.env.TESTING_FIREBASE_DATABASE_URL,
			projectId: process.env.TESTING_FIREBASE_PROJECT_ID,
			storageBucket: process.env.TESTING_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.TESTING_FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.TESTING_FIREBASE_APP_ID,
		};
	} else {
		firebase.config = {
			apiKey: process.env.FIREBASE_API_KEY,
			authDomain: process.env.FIREBASE_AUTH_DOMAIN,
			databaseURL: process.env.FIREBASE_DATABASE_URL,
			projectId: process.env.FIREBASE_PROJECT_ID,
			storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.FIREBASE_APP_ID,
		};
	}

	// Init Firebase
	const app = initializeApp(firebase.config);
	firebase.database = getDatabase(app);
	// Init regs
	firebase.leaderboardRef = ref(firebase.database, 'Leaderboard');
	firebase.blacklistRef = ref(firebase.database, 'blacklist');
	firebase.usersRef = ref(firebase.database, 'test');
	firebase.totalGamesPlayedRef = ref(firebase.database, 'TotalGamesPlayed');

	console.log(`Initialized firebase (${testing ? 'testing' : 'prod'})`);
};

/**
 * Fetches the leaderboard data from Firebase
 * @async
 * @return {Promise<Object|null>} The leaderboard data, or null if there is no data.
 */
firebase.getLeaderboard = async () => {
	const leaderboard = await get(firebase.leaderboardRef);

	return leaderboard.exists() && leaderboard.val();
};

/**
 * Updates the user score on the leaderoard
 * @param {Object} user
 */
firebase.updateLeaderboard = async (user) => {
	const leaderboard = await firebase.getLeaderboard();
	let updated = false;

	// If the user is already in the leaderboard, update their score
	for (const player of Object.values(leaderboard)) {
		if (utils.compareUser(user, player)) {
			player.score = user.score;
			updated = true;

			break;
		}
	}

	// else, add the user to the leaderboard
	if (!updated) {
		leaderboard.push({
			id: user.id,
			name: user.name,
			score: user.score,
		});

		// And sort to make sure the leaderboard is in order
		leaderboard.sort((a, b) => b.score - a.score);
	}

	// Update the leaderboard
	await set(firebase.leaderboardRef, leaderboard);
};

/**
 * @async
 * @function firebase.getBlacklist
 * @returns {Promise<Object>} A promise that resolves to an object representing the blacklist,
 *                          or null if the blacklist does not exist.
 */
firebase.getBlacklist = async () => {
	const blacklist = await get(firebase.blacklistRef);

	return blacklist.exists() && blacklist.val();
};

/**
 * Check if a user is blacklisted
 * @async
 * @param {string[]} identifiers - An array of user identifiers
 * @return {boolean} If any of the given identifiers are blacklisted
 */
firebase.isUserBlacklisted = async (identifiers) => {
	const blacklist = await firebase.getBlacklist();

	// Check if a users id or name is blacklisted
	for (const identifier of identifiers) {
		if (Object.values(blacklist).includes(identifier)) {
			return true;
		}
	}
};

/**
 * Gets the list of users from the database.
 *
 * @returns {Promise<Object>} A promise that resolves with the list of users.
 */
firebase.getUsers = async () => {
	const users = await get(firebase.usersRef);

	return users.exists() && users.val();
};

/**
 * @async
 * @function userExists
 * @param {object} user - the user to check for existence
 * @returns {boolean} - true if the user exists, false otherwise
 */
firebase.userExists = async (user) => {
	const users = await firebase.getUsers();

	// Go through each user and check if the user is the requested user
	for (const [uid, player] of Object.entries(users)) {
		if (utils.compareUser(user, player, uid)) {
			return true;
		}
	}
};

/**
 * @async
 * @function createUser
 * @param {object} user
 * @param {string} user.id
 * @param {string} user.name
 * @description Creates a user in the database.
 */
firebase.createUser = async (user) => {
	await update(child(firebase.usersRef, user.uid), {
		id: user.id,
		name: user.name,
		score: 0,
	});
};

/**
 * @async
 * @function firebase.getUser
 * @param {Object} user - The user object to compare with users in the database
 * @returns {Promise<Object>} - Returns the user object from the database that matches the criteria
 */
firebase.getUser = async (user) => {
	const users = await firebase.getUsers();

	for (const [uid, player] of Object.entries(users)) {
		if (utils.compareUser(user, player, uid)) {
			return player;
		}
	}
};

/**
 * @async
 * @function firebase.getTotalGamesPlayed
 * @summary Get the number of total games played from Firebase
 * @returns {Promise<number|null>} - Returns a promise that resolves with the number of testing games played, or null if no value exists
 */
firebase.getTotalGamesPlayed = async () => {
	const totalGamesPlayed = await get(firebase.totalGamesPlayedRef);

	return totalGamesPlayed.exists() && totalGamesPlayed.val();
};

/**
 * @async
 * @function incrementTotalGamesPlayed
 * @returns {Promise<void>}
 * @description Increments the number of total games played by 1
 */
firebase.incrementTotalGamesPlayed = async () => {
	const totalGamesPlayed = await firebase.getTotalGamesPlayed();

	set(firebase.totalGamesPlayedRef, totalGamesPlayed + 1);
};

/**
 * Increments the number of games played today.
 */
firebase.incrementDateGamesPlayed = async () => {
	const date = utils.getDate();
	const dateRef = ref(firebase.database, date);
	const gamesPlayed = await get(dateRef);

	if (!gamesPlayed.exists()) {
		await set(dateRef, 1);

		return;
	}

	await set(dateRef, gamesPlayed.val() + 1);
};

module.exports = firebase;
