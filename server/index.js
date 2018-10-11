require('dotenv').config();
// require('newrelic');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis'); // Redis
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

const client = redis.createClient(); // Redis

const express = require('express');
const { getRelated } = require('../database/Loader');

const app = express();
client.on('error', (err) => { // Redis
  console.log(`Error ${err}`);
});
client.on('connect', () => { // Redis
  console.log('Redis connected: Operational');
});
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/../client/dist`));
// app.use((req, res, next) => {
//   console.log(`${req.method} request received at ${req.url}`);
//   next();
// });

app.get('/api/:id', (req, res) => { // With Redis
  client.getAsync(`product:${req.params.id}`)
    .then((reply) => {
      if (reply) {
        console.log('from Redis');
        res.json(JSON.parse(reply));
      } else {
        getRelated(req.params.id, (err, result) => {
          if (err) {
            res.status(503).send(err);
          } else {
            client.setexAsync(`product:${req.params.id}`, 300, JSON.stringify(result.rows[0]));
            console.log('From DB');
            res.json(result.rows[0]);
          }
        });
      }
    })
    .catch((err) => {
      console.log('Error ', err);
    });
});

// app.get('/api/:id', (req, res) => { // Without Redis
//   getRelated(req.params.id, (err, result) => {
//     if (err) {
//       res.status(503).send(err);
//     } else {
//       res.json(result.rows[0]);
//     }
//   });
// });
// getRelated(req.params.id, (error, results) => {
//   if (error) {
//     res.status(503).send(error);
//   } else {
//     client.setAsync(`product:${req.params.id}`, 60, JSON.stringify(results.rows[0]));
//     console.log('From DB');
//     res.json(results.rows[0]);
//   }
// }


// app.post('/products', (req, res) => {
//   addRelated(req.body);
//   res.json('ADDED!');
// });

// app.put('/product', (req, res) => {
//   controllers.updateRelated(req.body);
//   res.json('PUT REQUEST RECEIVED');
// }); // TODO: implement this
// app.delete('/product', (req, res) => {
//   controllers.deleteRelated(req.body.id);
//   res.json('DELETE REQUEST RECEIVED');
// });


const PORT = 1337;
app.listen(PORT, () => {
  console.log(`Port ${PORT} connected: Operational`);
});
