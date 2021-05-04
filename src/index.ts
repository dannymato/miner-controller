import express, {Response} from 'express';
import createMiner from './miner';
import loadConfig from './config';
const app = express();
const port = 3000;

const config = loadConfig('./config.yml');
const miner = createMiner(config);


// Common method to catch mining API errors
const errCatch = (res: Response) =>
  (err: Error) =>
    res.status(500)
        .send({message: err.message});

// Check for miner liveness
// Should this be moved to the createMiner?
miner.summary().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

app.get('/summary', (req, res) => {
  miner.summary()
      .then((data) => {
        res.send(data);
      })
      .catch(errCatch(res));
});

app.get('/gpus/count', (req, res) => {
  miner.gpuCount()
      .then((data) => {
        res.send(data);
      })
      .catch(errCatch(res));
});

app.put('/gpus/:index/enable', (req, res) => {
  miner.enableGpu(req.params['index'])
      .then((data) => {
        res.send(data);
      })
      .catch(errCatch(res));
});

app.put('/gpus/:index/disable', (req, res) => {
  miner.disableGpu(req.params['index'])
      .then((data) => {
        res.send(data);
      })
      .catch(errCatch(res));
});

app.get('/gpus/:index', (req, res) => {
  miner.gpu(req.params['index'])
      .then((data) => {
        res.send(data);
      })
      .catch(errCatch(res));
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

