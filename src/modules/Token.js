import React from "react";
import { ethers } from "ethers";

import DataBridge from "../helpers/DataBridge";

class Token extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      balance: undefined,
    };

    this.state = { ...this.initialState };

    const TOKEN_ADDRESS = "0xA15f7A9216093111A2d7791ef8a76b7d1C67fA12";
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

    this.contract = new ethers.Contract(
      TOKEN_ADDRESS,
      abi,
      window.fucksapp.wallet
    );

    this.balanceOfToken = this.balanceOfToken.bind(this);
  }

  componentDidMount() {
    this.balanceOfToken();
  }

  async balanceOfToken() {
    const balance = (
      await this.contract.balanceOf(
        "0xE52772e599b3fa747Af9595266b527A31611cebd"
      )
    ).toString();
    this.setState({ balance });
  }

  render() {
    return (
      <div>
        <h1>Token</h1>
        balance: <h2>{this.state.balance}</h2>
      </div>
    );
  }
}

export default Token;
