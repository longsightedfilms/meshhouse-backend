import jayson from 'jayson'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import * as CategoryAPI from './modules/categories.mjs'
import * as Auth from './modules/auth.mjs'
import { getModels, getSingleModel } from './modules/models.mjs'
import { __dirname } from './constants.mjs'
import { logger } from './modules/logger.mjs'
import config from './config.json'

const jsonParser = bodyParser.json
const app = express()

// create a server
const server = jayson.server({
  "auth.login": async function(args, done) {
    const result = await Auth.Login(args)
    done(null, result)
  },
  "auth.signup": async function(args, done) {
    const result = await Auth.SignUp(args)
    done(null, result)
  },
  "category.add": async function(args, done) {
    if (await Auth.checkUserPrivileges(args.email, args.token, 'admin') === 'accepted')
    {
      const result = await CategoryAPI.addCategory(args)
      done(null, result)
    } else {
      done(null, 'User not prompted')
    }
  },
  "category.edit": async function(args, done) {
    if (await Auth.checkUserPrivileges(args.email, args.token, 'admin') === 'accepted')
    {
      const result = await CategoryAPI.editCategory(args)
      done(null, result)
    } else {
      done(null, 'User not prompted')
    }
  },
  "category.get": async function(args, done) {
    const categories = await CategoryAPI.getCategories()
    done(null, categories)
  },
  "category.get.single": async function(args, done) {
    const category = await CategoryAPI.getCategorySingle(args)
    done(null, category)
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
app.use('/backend/upload/', express.static(`./upload/`));
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

app.listen(config.server_port, () => {
  logger.info(`Server started on port ${config.server_port}`)
});
