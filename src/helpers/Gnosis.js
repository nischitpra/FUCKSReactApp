import { ethers } from "ethers";

// methods to setup safe
import safeAbi from "../abi/gnosis/safe.json";
// interaction with contract
import proxyFactoryAbi from "../abi/gnosis/proxy_factory.json";
import fallbackAbi from "../abi/gnosis/fallback_handler.json";

import Txn from "../helpers/Txn";

class Gnosis {
  fucksapp = window.fucksapp;
  databridge = this.fucksapp.databridge;

  constructor() {
    this.init();
  }

  init() {
    this.safeInterface = new ethers.utils.Interface(safeAbi.abi);
    this.contractFactory = new ethers.Contract(this._getFactoryAddress(), proxyFactoryAbi.abi, this.fucksapp.wallet);
  }

  async createSafe(owners, threshold) {
    const res = await Txn.sendTxn(
      this.contractFactory,
      "createProxyWithNonce",
      this._getSafeAddress(),
      this._getSafeSetupData(owners, threshold),
      new Date().getTime(),
      {
        gasLimit: 1000000,
      }
    );
    console.log(res);
    return res;
  }

  _getSafeSetupData(owners, threshold) {
    return this.safeInterface.encodeFunctionData("setup", [
      owners,
      threshold,
      "0x0000000000000000000000000000000000000000",
      "0x",
      this._getFallbackAddress(),
      "0x0000000000000000000000000000000000000000",
      "0",
      "0x0000000000000000000000000000000000000000",
    ]);
  }

  _getFactoryAddress() {
    const address = proxyFactoryAbi.networkAddresses[this.fucksapp.network.chainId];
    if (!address) throw "Network not supported";
    return address;
  }

  _getSafeAddress() {
    const address = safeAbi.networkAddresses[this.fucksapp.network.chainId];
    if (!address) throw "Network not supported";
    return address;
  }

  _getFallbackAddress() {
    const address = fallbackAbi.networkAddresses[this.fucksapp.network.chainId];
    if (!address) throw "Network not supported";
    return address;
  }
}

export default Gnosis;
