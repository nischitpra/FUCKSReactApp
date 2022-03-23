import React from "react";
import { ethers } from "ethers";

import DataBridge from "../helpers/DataBridge";
import Safe from "./Safe";


class Dashboard extends React.Component {
  fucksapp = window.fucksapp;
  databridge = this.fucksapp.databridge;
  
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

    this.state = {
      TOKEN_ADDRESS,
      fucksContract: new ethers.Contract(TOKEN_ADDRESS, abi, this.fucksapp.wallet),
      fucksDetails: {},
    };

    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.getBasicDetails = this.getBasicDetails.bind(this);
    this.transferToken = this.transferToken.bind(this);
    this.renderAccount = this.renderAccount.bind(this);
    this.renderDashboard = this.renderDashboard.bind(this);
  }

  componentDidMount() {
    this.databridge.sub(DataBridge.TOPIC.ACCOUNT_CHANGE, this.handleAccountChange);
    if(this.fucksapp.account) {
      this.handleAccountChange()
    }
  }

  async handleAccountChange() {
    await this.getBasicDetails();
  }

  async getBasicDetails() {
    const name = (await this.state.fucksContract.name()).toString();
    const decimals = parseInt((await this.state.fucksContract.decimals()).toString());
    const symbol = (await this.state.fucksContract.symbol()).toString();
    const totalSupply = (await this.state.fucksContract.totalSupply()).toString();
    const balance = (await this.state.fucksContract.balanceOf(this.fucksapp.account)).div(10 ** decimals).toString();
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

  renderDashboard() {
    return (
      <div>
        <Safe />
        <h1>{this.state.fucksDetails.name}</h1>
        <h2>({this.state.fucksDetails.symbol})</h2>
        <h1>{this.renderAccount()}</h1>
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

  render() {
    return <div>{this.renderDashboard()}</div>;
  }
}

export default Dashboard;
