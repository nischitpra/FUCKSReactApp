import React from "react";

import snapshot from "@snapshot-labs/snapshot.js";

class Safe extends React.Component {
  fucksapp = window.fucksapp;

  constructor(props) {
    super(props);
    this.state = {};

    this.getScore = this.getScore.bind(this);
    this.createProposal = this.createProposal.bind(this);
  }

  componentDidMount() {
    this.getScore();
  }

  async getScore() {
    const space = "yam.eth";
    const strategies = [
      {
        name: "erc20-balance-of",
        params: {
          address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          symbol: "DAI",
          decimals: 18,
        },
      },
    ];
    const network = "1";
    const voters = ["0xa478c2975ab1ea89e8196811f51a7b7ade33eb11", "0xeF8305E140ac520225DAf050e2f71d5fBcC543e7", "0x1E1A51E25f2816335cA436D65e9Af7694BE232ad"];
    const blockNumber = 11437846;

    const score = await snapshot.utils.getScores(space, strategies, network, voters, blockNumber);
    this.setState({ score });
  }

  async createProposal() {
    const hub = "https://snapshot.org/"; // or https://testnet.snapshot.org for testnet
    const client = new snapshot.Client712(hub);
    const receipt = await client.proposal(this.fucksapp.wallet, this.fucksapp.account, {
      space: "daouniverse.eth",
      type: "single-choice",
      title: "Test proposal using Snapshot.js",
      body: "",
      choices: ["Alice", "Bob", "Carol"],
      start: 1648189566,
      end: 1648193166,
      snapshot: 14453547, // how do we get this id?
      network: "1",
      // how to get strategies?
      strategies: JSON.stringify([{ name: "erc20-balance-of", network: "1", params: { symbol: "GCR", address: "0x6307b25a665efc992ec1c1bc403c38f3ddd7c661", decimals: 18 } }]),
      plugins: JSON.stringify({}),
      metadata: JSON.stringify({}),
    });
    console.log("createProposal", receipt);
  }

  render() {
    if (!this.fucksapp.network) return <div></div>;
    return (
      <div>
        <h1>Safe</h1>
        <h2>Snapshot test</h2>
        <h2>Score</h2>
        <h1>{JSON.stringify(this.state.score)}</h1>
        <h1>{JSON.stringify(snapshot.utils.getProvider(this.fucksapp.network.chainId))}</h1>
        {this.fucksapp.network.name}
        <button onClick={this.createProposal}>Create Proposal</button>
        <hr />
      </div>
    );
  }
}

export default Safe;
