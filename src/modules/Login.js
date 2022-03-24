import React from "react";
import { ethers } from "ethers";

import DataBridge from "../helpers/DataBridge";
import Dashboard from "./Dashboard";
import DashboardFunc from "./DashboardFunc";

class Login extends React.Component {
  fucksapp = window.fucksapp;
  databridge = this.fucksapp.databridge;

  constructor(props) {
    super(props);

    this.state = {};

    this.fucksapp.wallet = new ethers.providers.Web3Provider(window.ethereum);

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
      await this._syncWalletAccount(this.fucksapp.account);
      await this._syncWalletNetwork(this.fucksapp.network);
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
    }
    return network;
  }

  async connectWallet() {
    const accounts = await this.fucksapp.wallet.send("eth_requestAccounts", []);
    this._setAccount(accounts[0]);
    return accounts[0];
  }

  async _getWalletAccount() {
    return (await this.fucksapp.wallet.listAccounts())[0];
  }

  async _getWalletNetwork() {
    try {
      return await this.fucksapp.wallet.getNetwork();
    } catch (e) {
      // network changed. ether.js suggests reload of website on network change
      window.location.reload();
    }
  }

  _setAccount(account, prevAccount) {
    this.fucksapp.prevAccount = prevAccount;
    this.fucksapp.account = account;
    this.databridge.pub(DataBridge.TOPIC.ACCOUNT_CHANGE, { prevAccount, account });
    this.forceUpdate();
  }

  _setNetwork(network, prevNetwork) {
    this.fucksapp.prevNetwork = prevNetwork;
    this.fucksapp.network = network;
    this.databridge.pub(DataBridge.TOPIC.NETWORK_CHANGE, { prevNetwork, network });
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
    // return this.fucksapp.account ? <Dashboard account={this.fucksapp.account} network={this.fucksapp.network} /> : this.renderLogin();
    return this.fucksapp.account ? <DashboardFunc /> : this.renderLogin();
  }
}

export default Login;
