# Miner Controller

## Summary
This is a node.js based controller for miners using the [sgminer API](https://github.com/sgminer-dev/sgminer/blob/master/doc/API.md) (eg. teamredminer).

The object of this was to turn the TCP socket based API into a more friendly HTTP API and eventually to be able to control the miner from a website calling the API
Even though it should only be reached by the local network could probably use some kind of security of some sort
