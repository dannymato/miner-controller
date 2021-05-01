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
   */
  constructor(private host: string, private port: number) {}
  /**
   * Sends the specified command to the server
   * Commands can be found here https://github.com/sgminer-dev/sgminer/blob/master/doc/API.md
   * @param {string} command Command to send to the miner
   * @param {string} parameters Optional parameters to send to the miner
   * @param {SocketReader} callback Callback function to read from the stream
   */
  public sendCommand(command: string, parameters: string,
      callback: SocketReader) {
    const socket = net.createConnection({
      writable: true,
      readable: true,
      port: this.port,
      host: this.host,
    });

    const commandObj = {
      command: command,
      parameters: parameters,
    };

    socket.on('data', callback);

    socket.write(JSON.stringify(commandObj));
  }
}
