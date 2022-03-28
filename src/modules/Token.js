import React from "react";
import { ethers } from "ethers";

import DataBridge from "../helpers/DataBridge";

class Token extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {};

    this.state = { ...this.initialState };
  }

  render() {
    return (
      <div>
        <h1>Token</h1>
        <p>deploy tokens contract with user parameters</p>
      </div>
    );
  }
}

export default Token;
