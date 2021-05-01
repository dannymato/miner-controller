import express from 'express';
import {createMiner} from './miner';
const app = express();
const port = 3000;

const miner = createMiner('localhost', 4028);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/summary', (req, res) => {
  miner.summary((data) => {
    res.send(data);
  });
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

