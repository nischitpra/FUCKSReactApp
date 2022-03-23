class DataBridge {
  static TOPIC = {
    ACCOUNT_CHANGE: "account_change",
    NETWORK_CHANGE: "network_change",
  };

  topics = {};

  pub(topic, data) {
    const cbs = this.topics[topic];
    if (!cbs || !cbs.length) return;
    for (let i = 0; i < cbs.length; i++) {
      cbs[i](data);
    }
  }

  sub(topic, cb) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(cb);
  }

  // cb should have same signature as in sub
  unsub(topic, cb) {
    const cbs = this.topics[topic];
    if (!cbs || !cbs.length) return;
    const idx = cbs.indexOf(cb);
    if (!idx) return;
    cbs.splice(idx, 1);
  }
}

export default DataBridge;
