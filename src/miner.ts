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

type SummaryCallback = (data: MinerReturn<Summary>) => void;
type GpusCallback = (data: MinerReturn<GPUs>) => void;
type CountCallback = (data: MinerReturn<Count>) => void;
type StatusCallback = (data: Status) => void;

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
   * @param {SummaryCallback} callback What to do with the data
   */
  public summary(callback: SummaryCallback) {
    const command = 'summary';
    const params = '';

    this.api.sendCommand(command, params, (data) => {
      callback(this.parseMessage<Summary>(data.toString(), 'SUMMARY'));
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
   * @param {GpusCallback} callback What to do with the parsed data
   */
  public gpu(index: string, callback: GpusCallback) {
    const command = 'gpu';
    const params= index;

    this.api.sendCommand(command, params, (data) => {
      callback(this.parseMessage<GPUs>(data.toString(), 'GPU'));
    });
  }

  /**
   *
   * @param {CountCallback} callback
   */
  public gpuCount(callback: CountCallback) {
    const command = 'gpucount';
    const params = '';

    this.api.sendCommand(command, params, (data) => {
      callback(this.parseMessage(data.toString(), 'GPUS'));
    });
  }

  /**
   * Enable the specified GPU
   * @param {string} index The index of the gpu to enable
   * @param {StatusCallback} callback What to do with the data
   */
  public enableGpu(index: string, callback: StatusCallback) {
    const command = 'gpuenable';
    const params = index;

    this.api.sendCommand(command, params, (data) => {
      callback(this.statusOnlyParseMessage(data.toString()));
    });
  }

  /**
   * Disable the specified GPU
   * @param {string} index The index of the gpu to disable
   * @param {StatusCallback} callback What to do with the data
   */
  public disableGpu(index: string, callback: StatusCallback) {
    const command = 'gpudisable';
    const params = index;

    this.api.sendCommand(command, params, (data) => {
      callback(this.statusOnlyParseMessage(data.toString()));
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
