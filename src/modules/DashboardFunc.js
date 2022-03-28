import { useState, useEffect } from "react";
import { ethers } from "ethers";

import DataBridge from "../helpers/DataBridge";
import Safe from "./Safe";
import Blog from "./Blog";
import Snapshot from "./Snapshot";
import Token from "./Token";

const DashboardFunc = () => {
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

  const initialState = {
    TOKEN_ADDRESS,
    fucksContract: new ethers.Contract(
      TOKEN_ADDRESS,
      abi,
      window.fucksapp.wallet
    ),
    fucksDetails: {},
    balance: undefined,
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    window.fucksapp.databridge.sub(
      DataBridge.TOPIC.ACCOUNT_CHANGE,
      handleAccountChange
    );
    if (window.fucksapp.account) {
      handleAccountChange();
    }
  }, []);

  function resetState() {
    setState(initialState);
  }
  function updateState(update) {
    setState({ ...state, ...update });
  }

  async function handleAccountChange() {
    resetState();
    getBasicDetails();
  }

  async function getBasicDetails() {
    const name = (await state.fucksContract.name()).toString();
    const decimals = parseInt(
      (await state.fucksContract.decimals()).toString()
    );
    const symbol = (await state.fucksContract.symbol()).toString();
    const totalSupply = (await state.fucksContract.totalSupply()).toString();
    const balance = (
      await state.fucksContract.balanceOf(window.fucksapp.account)
    )
      .div(10 ** decimals)
      .toString();
    updateState({
      balance,
      fucksDetails: {
        name,
        symbol,
        decimals,
        totalSupply: totalSupply.toString(),
      },
    });
    return balance;
  }

  async function transferToken() {
    const receiverAddress = document.getElementById("receiver_address").value;
    const tokenAmount = document.getElementById("token_amount").value;
    const unsingedTxn = await state.fucksContract.populateTransaction.transfer(
      receiverAddress,
      tokenAmount
    );
    console.log(receiverAddress, tokenAmount);
    const res = await window.fucksapp.wallet
      .getSigner()
      .sendTransaction(unsingedTxn);
    console.log(res);
  }

  function renderAccount() {
    return (
      <div>
        <h1>Connected!</h1>
        <span>
          <h3>{window.fucksapp.account}</h3>
          <h4>
            {state.balance} {state.fucksDetails.symbol}
          </h4>
        </span>
      </div>
    );
  }

  function renderNetwork() {
    if (!window.fucksapp.network) return;
    return (
      <div>
        <h2>{window.fucksapp.network.name}</h2>
      </div>
    );
  }

  function renderDashboard() {
    return (
      <div>
        <Token />
        <Safe />
        <Snapshot />
        <h1>{state.fucksDetails.name}</h1>
        <h2>({state.fucksDetails.symbol})</h2>
        <h1>{renderAccount()}</h1>
        <h1>{renderNetwork()}</h1>
        <div>
          <h1>Details</h1>
          <div>
            <span>Total Supply: </span>
            <span>{state.fucksDetails.totalSupply}</span>
          </div>
          <div>
            <span>Balance: </span>
            <span>{state.balance}</span>
          </div>
          <div>
            <input id="receiver_address" placeholder="receiver address" />
            <input id="token_amount" placeholder="token amount" />
            <button onClick={transferToken}>
              Send {state.fucksDetails.symbol}
            </button>
          </div>
        </div>
        <Blog />
      </div>
    );
  }

  return <div>{renderDashboard()}</div>;
};

export default DashboardFunc;
