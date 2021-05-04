import net from 'net';

export type SocketReader = (data: Buffer) => void;

/**
 * Class that physically interacts with the api
 */
export default class MinerAPI {
  /**
   * Saves the URL for further use
   * @param {string} host contains the host of the Mining api
   * @param {number} port contains the port for the api
   * @param {number} timout has the time to wait for the miner to respond (ms)
   */
  constructor(private host: string, private port: number,
        private timeout: number) {}
  /**
   * Sends the specified command to the server
   * Commands can be found here https://github.com/sgminer-dev/sgminer/blob/master/doc/API.md
   * @param {string} command Command to send to the miner
   * @param {string} parameters Optional parameters to send to the miner
   * @return {Promise<Buffer>} A promise for the return of the API
   */
  public sendCommand(command: string, parameters = '') : Promise<Buffer> {
    const socket = net.createConnection({
      writable: true,
      readable: true,
      port: this.port,
      host: this.host,
      timeout: this.timeout, // Could change this to be a config option
    });

    const returnPromise = new Promise<Buffer>((resolve, reject) => {
      socket.on('error', (err) => {
        reject(new Error(`Could not connect to miner at ${this.host}:` +
        `${this.port}\n${err.message}`));
      });

      socket.on('timeout', () => {
        reject(new Error(`Timed out connecting to miner at ${this.host}:`+
          `${this.port}`));
      });

      socket.on('data', (data) => {
        resolve(data);
      });
    });

    const commandObj = {
      command: command,
      parameters: parameters,
    };

    socket.write(JSON.stringify(commandObj));

    return returnPromise;
  }
}
