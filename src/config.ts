import yaml from 'yaml';
import fs from 'fs';

/**
 * Data to be stored in the config
 */
class ConfigData {
  minerTimeout!: number;
  host!: string;
  port!: number;

  /**
   * Contructs the data from the yaml
   * @param {ConfigData} args Holds the args from yaml file
   */
  constructor(args : ConfigData) {
    Object.assign(this, args);
  }
}

/**
 * Holds the config
 */
export class Config extends ConfigData {}

/**
 * Loads the config from the file and returns it
 * @param {string} path path of the config
 * @return {Config} Config data
 */
export default function loadConfig(path: string) : Config {
  return new Config(yaml.parse(fs.readFileSync(path, 'utf8')));
}

