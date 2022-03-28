import React from "react";

import Gnosis from "../helpers/gnosis/Gnosis";

import network from "../helpers/gnosis/Network";
import DataBridge from "../helpers/DataBridge";

const styles = {
  textarea: {
    width: "50%",
  },
};

class Safe extends React.Component {
  constructor(props) {
    super(props);
    this.gnosis = new Gnosis();

    this.initialState = {
      safes: [],
      safeDetails: undefined,
    };

    this.state = { ...this.initialState };

    this.resetState = this.resetState.bind(this);
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.createSafe = this.createSafe.bind(this);
    this.getSafesForOwner = this.getSafesForOwner.bind(this);
    this.getSafeDetails = this.getSafeDetails.bind(this);
    this.renderSafes = this.renderSafes.bind(this);
  }

  componentDidMount() {
    window.fucksapp.databridge.sub(
      DataBridge.TOPIC.ACCOUNT_CHANGE,
      this.handleAccountChange
    );
    this.getSafesForOwner();
  }

  resetState() {
    this.setState({ ...this.initialState });
  }

  async handleAccountChange() {
    this.resetState();
    this.gnosis = new Gnosis();
    this.getSafesForOwner();
  }

  async createSafe() {
    const owners = document.getElementById("safe_owners").value.split("\n");
    const threshold = parseInt(
      document.getElementById("safe_vote_threshold").value
    );

    if (!owners || !threshold)
      return alert("Need to enter owners and threshold");
    if (owners.length < threshold) return alert("Invalid threshold");

    const res = await this.gnosis.createSafe(owners, threshold);
  }

  async getSafesForOwner() {
    const safes = await network.getSafesForOwner(window.fucksapp.account);
    this.setState({ safes });
  }

  async getSafeDetails(safeAddress) {
    const safeDetails = await network.getSafeDetails(safeAddress);
    console.log(safeDetails);
    this.setState({ safeDetails });
  }

  renderSafes() {
    const safes = [];
    for (let i = 0; i < this.state.safes.length; i++) {
      const safe = this.state.safes[i];
      safes.push(
        <div key={safe}>
          <button onClick={() => this.getSafeDetails(safe)}>{safe}</button>
        </div>
      );
    }
    return safes;
  }

  render() {
    return (
      <div>
        <h1>Safe</h1>
        <div>
          <textarea
            id="safe_owners"
            placeholder={"0x1123...\n0x2345...\n0x456E..."}
            style={styles.textarea}
          />
          <br />
          <input id="safe_vote_threshold" type="number" />
          <br />
          <button onClick={this.createSafe}>Create Safe</button>
          <button onClick={this.getSafesForOwner}>Get Safe</button>
          {this.renderSafes()}
          {JSON.stringify(this.state.safeDetails)}
        </div>
      </div>
    );
  }
}

export default Safe;
