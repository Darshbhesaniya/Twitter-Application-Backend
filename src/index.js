import express from 'express';
import {connect} from './config/database.js';
const app = express();

import { PORT } from './config/serverconfig.js';

import service from './services/tweet-service.js'

app.listen(PORT, async () => {
    console.log(`Server Started Successfully on ${PORT}`);
    await connect();
    console.log("Mongo Db connected");
    let ser = new service();
    await ser.create({content: 'Done With #Es6Module '});
})