const express = require('express');
const utils = require('./utils');
const firebase = require('./web/firebase');

const app = express();

app.use(express.json());

// For status check, just route to the homepage
app.get('/', (req, res) => {
	res.status(200).end('lankmann.github.io/GetTam');
});

// Anyone can get the leaderboard
app.get('/Leaderboard', async (req, res) => {
	// Always try/catch so no one can take down the server with an error
	try {
		const leaderboard = await firebase.getLeaderboard();
		res.status(200).json(leaderboard);
	} catch (err) {
		console.error(err);
		res.status(500).end('Internal Server Error');
	}
});

app.post('/Leaderboard', async (req, res) => {
	try {
		const requestIp = utils.getRequestIp(req);
		const user = req.body;

		if (!utils.verifyUserRequest(user) || !utils.verifyScore(user.score)) {
			res.status(400).end('Bad Request');

			return;
		}

		if (await firebase.isUserBlacklisted([requestIp, user, user.id])) {
			res.status(403).end('Forbidden');

			return;
		}

		if (!(await firebase.userExists(user))) {
			await firebase.createUser(user);
		}

		await firebase.updateLeaderboard(user);

		res.status(200).end('OK');
	} catch (err) {
		console.error(err);
		res.status(500).end('Internal Server Error');
	}
});

app.post('/user', async (req, res) => {
	try {
		const requestIp = utils.getRequestIp(req);
		const user = req.body;

		if (!utils.verifyUserRequest(user) || !utils.verifyScore(user.score)) {
			res.status(400).end('Bad Request');

			return;
		}

		if (await firebase.isUserBlacklisted([requestIp, user, user.id])) {
			res.status(403).end('Forbidden');

			return;
		}

		if (!(await firebase.userExists(user))) {
			await firebase.createUser(user);
		}

		res.status(200).end('OK');
	} catch (err) {
		console.error(err);
		res.status(400).end('Internal Server Error');
	}
});

app.post('/TotalGamesPlayed', async (req, res) => {
	try {
		const requestIp = utils.getRequestIp(req);
		const user = req.body;

		if (!utils.verifyUserRequest(user)) {
			res.status(400).end('Bad Request');

			return;
		}

		if (
			(await firebase.isUserBlacklisted([requestIp, user, user.id])) ||
			!(await firebase.userExists(user))
		) {
			res.status(403).end('Forbidden');

			return;
		}

		await firebase.incrementTotalGamesPlayed();
		await firebase.incrementDateGamesPlayed();
		res.status(200).end('OK');
	} catch (err) {
		console.error(err);
		res.status(500).end('Internal Server Error');
	}
});

const port = process.env.PORT || 8080;
firebase.init(port === 8080);

app.listen(port, () => {
	console.log(
		`GetTam Back-End running on port ${port} (${
			port === 8080 ? 'testing' : 'prod'
		})`
	);
});
