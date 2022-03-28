import React from "react";

import snapshot from "@snapshot-labs/snapshot.js";

class Snapshot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    const hub = "https://hub.snapshot.org";
    this.client = new snapshot.Client712(hub);

    this.getScore = this.getScore.bind(this);
    this.createProposal = this.createProposal.bind(this);
    this.vote = this.vote.bind(this);
  }

  componentDidMount() {
    this.getScore();
  }

  async getScore() {
    const space = "daouniverse.eth";
    const strategies = [
      {
        name: "erc20-balance-of",
        params: {
          address: "0xBDA762F6f8f093949A68f98d2a4b0C79CA6008c8",
          symbol: "FUCKS",
          decimals: 2,
        },
      },
    ];
    const network = window.fucksapp.network.chainId;
    const voters = [window.fucksapp.account, "0x3a86E9C1947f9ff49Abf2bCC3301008165636a5D"];
    const blockNumber = await window.fucksapp.wallet.getBlockNumber();

    const score = await snapshot.utils.getScores(space, strategies, network, voters, blockNumber);
    this.setState({ score });
  }

  async createProposal() {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }], // chainId must be in hexadecimal numbers
    });

    const startTime = Math.floor(new Date() / 1000) + 60 * 60;
    const endTime = startTime + 60 * 60;

    const receipt = await this.client.proposal(window.fucksapp.wallet, window.fucksapp.account, {
      space: "daouniverse.eth",
      type: "single-choice",
      title: "Able to create propsal without Block Number",
      body: "",
      choices: ["yes", "no", "failed to create proposal"],
      start: startTime,
      end: endTime,
      snapshot: await window.fucksapp.wallet.getBlockNumber(),
      network: "1",
      // how to get strategies?
      strategies: JSON.stringify([
        {
          name: "erc20-balance-of",
          network: "1",
          params: { symbol: "GCR", address: "0x6307b25a665efc992ec1c1bc403c38f3ddd7c661", decimals: 18 },
        },
      ]),
      plugins: JSON.stringify({}),
      metadata: JSON.stringify({}),
    });
    console.log("createProposal", receipt);
  }

  async vote() {
    const receipt = await this.client.vote(window.fucksapp.wallet, window.fucksapp.account, {
      space: "daouniverse.eth",
      proposal: "0x5c38c8b4bac2f8beaa1c9e2c89a62e4dcee4dd36ae9ea4aa67df2b558fdd6cb8",
      type: "single-choice",
      choice: 2,
      metadata: JSON.stringify({}),
    });
    console.log("vote proposal", receipt);
  }

  render() {
    if (!window.fucksapp.network) return <div></div>;
    return (
      <div>
        <h1>Snapshot</h1>
        <h2>Score</h2>
        <h1>{JSON.stringify(this.state.score)}</h1>
        <h1>{JSON.stringify(snapshot.utils.getProvider(window.fucksapp.network.chainId))}</h1>
        {window.fucksapp.network.name}
        <br />
        <button onClick={this.createProposal}>Create Proposal</button>
        <br />
        <button onClick={this.vote}>vote</button>
        <br />
        <hr />
      </div>
    );
  }
}

export default Snapshot;
