import jayson from 'jayson'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import { getCategories } from './modules/categories.mjs'
import { getModels, getSingleModel } from './modules/models.mjs'
import { __dirname } from './constants.mjs'
import { logger } from './modules/logger.mjs'

const jsonParser = bodyParser.json
const app = express()

// create a server
const server = jayson.server({
    "category.get": async function(args, done) {
        const categories = await getCategories()
        done(null, categories)
    },
    "models.get": async function (args, done) {
        const models = await getModels(args)
        done(null, models)
    },
    "models.get.single": async function (args, done) {
        const model = await getSingleModel(args)
        done(null, model)
    },
});

app.use(cors({methods: ["POST"]}));
app.use(jsonParser());
app.use('/backend/api/v1/', server.middleware());
app.use('/upload/', express.static(`${__dirname}/upload/`));
app.use(function (req, res, next) {
    const request = req.body;
    // <- here we can check headers, modify the request, do logging, etc
    server.call(request, function (err, response) {
        if (err) {
            // if err is an Error, err is NOT a json-rpc error
            if (err instanceof Error) return next(err);
            // <- deal with json-rpc errors here, typically caused by the user
            res.status(400);
            res.send(err);
            return;
        }
        // <- here we can mutate the response, set response headers, etc
        if (response) {
            res.send(response);
            console.log(response);
        } else {
            // empty response (could be a notification)
            res.status(204);
            res.send('');
        }
    });
});

app.listen(80, () => {
    logger.info('Server started on port 80')
});