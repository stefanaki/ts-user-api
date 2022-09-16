require('dotenv').config();
import express from 'express';
import config from 'config';
import connectToDb from './utils/connectToDb';
import log from './utils/logger';

import router from './routes';
import deserializeUser from '../middleware/deserializeUser';

const app = express();
const port = config.get<number>('port');

app.use(express.json());
app.use(deserializeUser);
app.use('/api', router);

app.listen(port, async () => {
	log.info(`Server listening on http://localhost:${port}...`);

	connectToDb();
});
