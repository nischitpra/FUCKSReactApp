import React from "react";

import Gnosis from "../helpers/Gnosis";

const styles = {
  textarea: {
    width: "50%",
  },
};

class Safe extends React.Component {
  constructor(props) {
    super(props);
    this.gnosis = new Gnosis();

    this.createSafe = this.createSafe.bind(this);
  }

  async createSafe() {
    const owners = document.getElementById("safe_owners").value.split("\n");
    const threshold = parseInt(document.getElementById("safe_vote_threshold").value);

    if (!owners || !threshold) return alert("Need to enter owners and threshold");
    if (owners.length < threshold) return alert("Invalid threshold");

    const res = await this.gnosis.createSafe(owners, threshold);
  }

  render() {
    return (
      <div>
        <h1>Safe</h1>
        <div>
          <textarea id="safe_owners" placeholder={"0x1123...\n0x2345...\n0x456E..."} style={styles.textarea} />
          <br />
          <input id="safe_vote_threshold" type="number" />
          <br />
          <button onClick={this.createSafe}>Create Safe</button>
        </div>
      </div>
    );
  }
}

export default Safe;
