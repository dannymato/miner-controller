import MinerAPI from './api';

// TODO: Move API stuff into a types submodule
interface MinerReturn<ItemType extends Item> {
  status: Status;
  data: ItemType;
}

interface Item {}

interface Summary extends Item {
  Elapsed: number;
  'Found Blocks': number;
  'MHS av': number;
  'MHS 30s': number;
}

interface Status {
  STATUS: string;
  When: number;
  Code: number;
  Msg: string;
  Description: string;
}

interface GPUs extends Item {
  GPU: GPU;
}

interface GPU {
  GPU: number;
  Enabled: string;
  Temperature: number;
  'Fan Speed': number;
  'Fan Percent': number;
  'GPU Clock': number;
  'Memory Clock': number;
  'GPU Voltage': number;
  'GPU Activity': number;
  'MHS av': number;
  'MHS 30s': number;
  Accepted: number;
  Rejected: number;
}

interface Count {
  Count: number;
}

/**
 * Class contains methods to retrieve items from the miner
 */
class Miner {
  /**
   * This one may not really need the host and port might delete
   * @param {string} host host that points to the miner
   * @param {number} port port of the miner
   * @param {MinerAPI} api the connection to the Miner
   */
  constructor(private host: string, private port: number,
      private api: MinerAPI) {}
  /**
   * Grabs the summary and passes it to the data
   * @return {Promise<MinerReturn<Summary>>} A promise for the async api call
   */
  public summary() : Promise<MinerReturn<Summary>> {
    const command = 'summary';

    return new Promise<MinerReturn<Summary>>((resolve, reject) => {
      this.api.sendCommand(command)
          .then((value) => {
            resolve(this.parseMessage<Summary>(value.toString(), 'SUMMARY'));
          }).catch((err) => {
            reject(err);
          });
    });
  }

  // Not an actual thing in the api
  // Could be changed to devices instead
  // /**
  //  * Grabs the info on all GPUs
  //  * @param {GpusCallback} callback What to do with the parsed data
  //  */
  // public gpus(callback: GpusCallback) {
  //   const command = 'gpu';
  //   const params = '';

  //   this.api.sendCommand(command, params, (data) => {
  //     callback(this.parseMessage<GPUs>(data.toString(), 'GPU'));
  //   });
  // }

  /**
   * Grabs info about the specified GPU
   * @param {string} index The GPU index to grab
   * @return {Promise<MinerReturn<GPUs>>} Promise for async API calls
   */
  public gpu(index: string) : Promise<MinerReturn<GPUs>> {
    const command = 'gpu';
    const params= index;

    return new Promise<MinerReturn<GPUs>>((resolve, reject) => {
      this.api.sendCommand(command, params)
          .then((value) => {
            resolve(this.parseMessage<GPUs>(value.toString(), 'GPU'));
          })
          .catch((err) => {
            reject(err);
          });
    });
  }

  /**
   * Get the amount of GPUs connected to the miner
   * @return {Promise<MinerReturn<Count>>} Promise to handle async API calls
   */
  public gpuCount() : Promise<MinerReturn<Count>> {
    const command = 'gpucount';

    return new Promise<MinerReturn<Count>>((resolve, reject) => {
      this.api.sendCommand(command)
          .then((value) => {
            resolve(this.parseMessage(value.toString(), 'GPUS'));
          })
          .catch((err) => {
            reject(err);
          });
    });
  }

  /**
   * Enable the specified GPU
   * @param {string} index The index of the gpu to enable
   * @return {Promise<Status>} Promise to handle async API calls
   */
  public enableGpu(index: string) : Promise<Status> {
    const command = 'gpuenable';
    const params = index;

    return new Promise<Status>((resolve, reject) => {
      this.api.sendCommand(command, params)
          .then((value) => {
            resolve(this.statusOnlyParseMessage(value.toString()));
          })
          .catch((err) => {
            reject(err);
          });
    });
  }

  /**
   * Disable the specified GPU
   * @param {string} index The index of the gpu to disable
   * @return {Promise<Status>} Promise to handle async API calls
   */
  public disableGpu(index: string) : Promise<Status> {
    const command = 'gpudisable';
    const params = index;

    return new Promise<Status>((resolve, reject) => {
      this.api.sendCommand(command, params)
          .then((value) => {
            resolve(this.statusOnlyParseMessage(value.toString()));
          })
          .catch((err) => {
            reject(err);
          });
    });
  }

  /**
   * Converts the calls which only return a status
   * @param {string} message The message from the API
   * @return {Status} The status from the API
   */
  private statusOnlyParseMessage(message: string): Status {
    const obj = JSON.parse(message);
    return obj.STATUS[0];
  }

  /**
   * Converts the raw input into nice TS types
   * Should eventually be a kind of conversion to nicer objects
   * @param {string} message The message from the API
   * @param {string} parameterName The name of the parameter
   * I don't like parameterName should be removed
   * @return {MinerReturn<MessageType>} The nice TS type
   */
  private parseMessage<MessageType>(message: string,
      parameterName: string): MinerReturn<MessageType> {
    const obj = JSON.parse(message);
    return {
      status: obj.STATUS[0],
      data: obj[parameterName][0],
    };
  }
}

/**
 * Constructs a miner
 * @param {string} host host that points to the miner
 * @param {number} port port of the MinerAPI
 * @return {Miner} returns a newly created miner
 */
export default function createMiner(host: string, port: number) : Miner {
  const api = new MinerAPI(host, port);
  return new Miner(host, port, api);
}
