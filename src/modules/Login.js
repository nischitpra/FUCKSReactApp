import React from "react";
import { ethers } from "ethers";

import DataBridge from "../helpers/DataBridge";
import DashboardFunc from "./DashboardFunc";
import {gnosis} from "../Constants"

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    window.fucksapp.wallet = new ethers.providers.Web3Provider(window.ethereum);

    this._setAccount = this._setAccount.bind(this);
    this.syncWalletData = this.syncWalletData.bind(this);
    this.getWalletConnectionStatus = this._syncWalletAccount.bind(this);
    this.getWalletAccount = this._getWalletAccount.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.state.refreshWalletInterval.clear();
  }

  async init() {
    this.syncWalletData();
  }

  async syncWalletData() {
    const refreshWalletInterval = setInterval(async () => {
      await this._syncWalletAccount(window.fucksapp.account);
      await this._syncWalletNetwork(window.fucksapp.network);
    }, 1000);
    this.setState({ refreshWalletInterval });
  }

  async _syncWalletAccount(_account) {
    const account = await this._getWalletAccount();
    if (_account != account) {
      this._setAccount(account, _account);
    }
    return account;
  }

  async _syncWalletNetwork(_network) {
    const network = await this._getWalletNetwork();
    if (_network != network) {
      this._setNetwork(network, _network);
      if(!gnosis.baseapi[network.chainId]) {
        alert("Network not supported!")
      }
    }
    return network;
  }

  async connectWallet() {
    const accounts = await window.fucksapp.wallet.send("eth_requestAccounts", []);
    this._setAccount(accounts[0]);
    return accounts[0];
  }

  async _getWalletAccount() {
    return (await window.fucksapp.wallet.listAccounts())[0];
  }

  async _getWalletNetwork() {
    try {
      return await window.fucksapp.wallet.getNetwork();
    } catch (e) {
      // network changed. ether.js suggests reload of website on network change
      window.location.reload();
    }
  }

  _setAccount(account, prevAccount) {
    window.fucksapp.prevAccount = prevAccount;
    window.fucksapp.account = account;
    window.fucksapp.databridge.pub(DataBridge.TOPIC.ACCOUNT_CHANGE, { prevAccount, account });
    this.forceUpdate();
  }

  _setNetwork(network, prevNetwork) {
    window.fucksapp.prevNetwork = prevNetwork;
    window.fucksapp.network = network;
    window.fucksapp.databridge.pub(DataBridge.TOPIC.NETWORK_CHANGE, { prevNetwork, network });
    this.forceUpdate();
  }

  renderLogin() {
    return (
      <div>
        <button onClick={this.connectWallet}>Connect MetaMask</button>
      </div>
    );
  }

  render() {
    return window.fucksapp.account && window.fucksapp.network ? <DashboardFunc /> : this.renderLogin();
  }
}

export default Login;
