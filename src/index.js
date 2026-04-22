import express from 'express';
import {connect} from './config/database.js';

import apiRoutes from './routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',apiRoutes);


import { PORT } from './config/serverconfig.js';

import service from './services/tweet-service.js'

app.listen(PORT, async () => {
    console.log(`Server Started Successfully on ${PORT}`);
    await connect();
    console.log("Mongo Db connected");
    // let ser = new service();
    // await ser.create({content: 'My other #CoDe is runn #EasiLY'});
})