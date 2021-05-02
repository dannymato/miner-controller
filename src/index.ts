import express from 'express';
import createMiner from './miner';
const app = express();
const port = 3000;

// TODO: Load this from a config file or something like that
const miner = createMiner('localhost', 4028);

app.get('/summary', (req, res) => {
  miner.summary((data) => {
    res.send(data);
  });
});

app.get('/gpus/count', (req, res) => {
  miner.gpuCount((data) => {
    res.send(data);
  });
});

app.put('/gpus/:index/enable', (req, res) => {
  miner.enableGpu(req.params['index'], (data) => {
    res.send(data);
  });
});

app.put('/gpus/:index/disable', (req, res) => {
  miner.disableGpu(req.params['index'], (data) => {
    res.send(data);
  });
});

app.get('/gpus/:index', (req, res) => {
  miner.gpu(req.params['index'], (data) => {
    res.send(data);
  });
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

