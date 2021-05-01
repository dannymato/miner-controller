import MinerAPI from './api';

export interface MinerReturn<ItemType extends Item> {
  status: Status;
  data: ItemType;
}

interface Item {}

export interface Summary extends Item {
  Elapsed: number;
  'Found Blocks': number;
  'MHS av': number;
  'MHS 30s': number;
}

export interface Status {
  STATUS: string;
  When: number;
  Code: number;
  Msg: string;
  Description: string;
}

export interface GPUs extends Item {
  GPU: GPU[];
}

export interface GPU {
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

type SummaryCallback = (data: MinerReturn<Summary>) => void

/**
 * Class contains methods to retrieve items from the miner
 */
export class Miner {
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

  /**
   * Converts the raw input into nice TS types
   * @param {string} message The message from the API
   * @param {string} parameterName The name of the parameter
   * I don't like parameterName should be removed
   * @return {MinerReturn<MessageType>} The nice TS type
   */
  private parseMessage<MessageType>(message: string,
      parameterName: string): MinerReturn<MessageType> {
    const obj = JSON.parse(message);
    return {
      status: obj.STATUS,
      data: obj[parameterName],
    };
  }
}
/**
 * @param {string} host host that points to the miner
 * @param {number} port port of the MinerAPI
 * @return {Miner} returns a newly created miner
 */
export function createMiner(host: string, port: number) : Miner {
  const api = new MinerAPI(host, port);
  return new Miner(host, port, api);
}
