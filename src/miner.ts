import MinerAPI from './api';

export interface SummaryReturn {
  STATUS: Status;
  SUMMARY: Summary;
}

export interface Summary {
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

type SummaryCallback = (data: SummaryReturn) => void

/**
 * Class contains methods to retrieve items from the miner
 */
export class Miner {
  /**
   *
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
      callback(JSON.parse(data.toString()));
    });
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
