require('dotenv').config();
import config from 'config';
import express from 'express';
import connectToDb from './utils/connectToDb';
import log from './utils/logger';

import deserializeUser from './middleware/deserializeUser';
import router from './routes';

const app = express();
const port = config.get<number>('port');

app.use(express.json());
app.use(deserializeUser);
app.use('/api', router);

app.listen(port, async () => {
	log.info(`Server listening on http://localhost:${port}...`);

	connectToDb();
});
