import React from "react";

// import { useTokenBalance, useEthers } from "@usedapp/core";

import { ethers } from "ethers";

class FUCKSToken extends React.Component {
  constructor(props) {
    super(props);
    const TOKEN_ADDRESS = "0xBDA762F6f8f093949A68f98d2a4b0C79CA6008c8";
    const abi = [
      "function name() public view returns (string)",
      "function decimals() public view returns (uint8)",
      "function symbol() public view returns (string)",
      "function totalSupply() public view returns (uint256)",
      "function balanceOf(address _owner) external view returns (uint256 balance)",
      "function transfer(address _to, uint256 _value) external returns (bool success)",
      "function transferFrom(address _from, address _to, uint256 _value) external returns (bool success)",
      "function approve(address _spender, uint256 _value) external returns (bool success)",
      "function allowance(address _owner, address _spender) external view returns (uint256 remaining)",
      "event Transfer(address indexed _from, address indexed _to, uint256 _value)",
      "event Approval(address indexed _owner, address indexed _spender, uint256 _value)",
    ];
    const wallet = new ethers.providers.Web3Provider(window.ethereum);
    this.state = {
      TOKEN_ADDRESS,
      wallet,
      fucksContract: new ethers.Contract(TOKEN_ADDRESS, abi, wallet),
      fucksDetails: {},
    };
    // web3 = new Web3(Web3.givenProvider);

    this.syncCurrentAccountInWallet = this.syncCurrentAccountInWallet.bind(this);
    this.getWalletConnectionStatus = this.getWalletConnectionStatus.bind(this);
    this.getWalletAccount = this.getWalletAccount.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.transferToken = this.transferToken.bind(this);
    this.renderAccount = this.renderAccount.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    this.syncCurrentAccountInWallet();
    this.setState({
      fucks: this.state.wallet,
    });
  }

  async syncCurrentAccountInWallet() {
    setInterval(async () => {
      await this.getWalletConnectionStatus(this.state.account);
    }, 1000);
  }

  async getWalletConnectionStatus(_account) {
    const account = await this.getWalletAccount();
    if (_account != account) {
      this.setState({ account });
      this.handleAccountChange(account, _account);
    }
    return account;
  }

  async handleAccountChange(account, prevAccount) {
    await this.getBasicDetails();
  }

  async connectWallet() {
    const accounts = await this.state.wallet.send("eth_requestAccounts", []);
    this.setState({ account: accounts[0] });
    return accounts[0];
  }

  async getWalletAccount() {
    return (await this.state.wallet.listAccounts())[0];
  }

  async getBasicDetails() {
    const name = (await this.state.fucksContract.name()).toString();
    const decimals = parseInt((await this.state.fucksContract.decimals()).toString());
    const symbol = (await this.state.fucksContract.symbol()).toString();
    const totalSupply = (await this.state.fucksContract.totalSupply()).toString();
    const balance = (await this.state.fucksContract.balanceOf(this.state.account)).div(10 ** decimals).toString();
    this.setState({ balance, fucksDetails: { name, symbol, decimals, totalSupply: totalSupply.toString() } });
    return balance;
  }

  async transferToken() {
    const receiverAddress = document.getElementById("receiver_address").value;
    const tokenAmount = document.getElementById("token_amount").value;
    const unsingedTxn = await this.state.fucksContract.populateTransaction.transfer(receiverAddress, tokenAmount);
    console.log(receiverAddress, tokenAmount);
    const res = await this.state.wallet.getSigner().sendTransaction(unsingedTxn);
    console.log(res);
  }

  renderAccount() {
    return (
      <div>
        <h1>Connected!</h1>
        <span>
          <h3>{this.state.account}</h3>
          <h4>
            {this.state.balance} {this.state.fucksDetails.symbol}
          </h4>
        </span>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>{this.state.fucksDetails.name}</h1>
        <h2>({this.state.fucksDetails.symbol})</h2>
        <h1>{this.state.account ? this.renderAccount() : <button onClick={this.connectWallet}>Connect MetaMask</button>}</h1>
        <div>
          <h1>Details</h1>
          <div>
            <span>Total Supply: </span>
            <span>{this.state.fucksDetails.totalSupply}</span>
          </div>
          <div>
            <span>Balance: </span>
            <span>{this.state.balance}</span>
          </div>
          <div>
            <input id="receiver_address" placeholder="receiver address" />
            <input id="token_amount" placeholder="token amount" />
            <button onClick={this.transferToken}>Send {this.state.fucksDetails.symbol}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default FUCKSToken;
