require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');


const express = require('express');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const controllers = require('../database/index.js');

app.use(express.static(`${__dirname}/../client/dist`));
app.use((req, res, next) => {
  console.log(`${req.method} request received at ${req.url}`);
  next();
});


app.get('/product', (req, res) => {
  controllers.getRelated(req.query.id, (err, results) => {
    if (err) {
      res.status(503).send(err);
    } else {
      res.json({
        data: results,
      });
    }
  });
});

app.post('/product', (req, res) => {
  controllers.addRelated(req.body);
  res.json('ADDED!');
});
app.put('/product', (req, res) => {
  controllers.updateRelated(req.body);
  res.json('PUT REQUEST RECEIVED');
}); // TODO: implement this
app.delete('/product', (req, res) => {
  controllers.deleteRelated(req.body.id);
  res.json('DELETE REQUEST RECEIVED');
});


const PORT = 4043;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
