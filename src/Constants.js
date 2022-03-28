const headers = {
  acceptJson: {
    accept: "application/json",
  },
};

const gnosis = {
  baseapi: {
    1: "https://safe-transaction.mainnet.gnosis.io",
    4: "https://safe-transaction.rinkeby.gnosis.io",
    10: "https://safe-transaction.optimism.gnosis.io",
    56: "https://safe-transaction.bsc.gnosis.io",
    100: "https://safe-transaction.xdai.gnosis.io",
    137: "https://safe-transaction.polygon.gnosis.io",
    246: "https://safe-transaction.ewc.gnosis.io",
    420: "https://safe-transaction.goerli.gnosis.io",
    42161: "https://safe-transaction.arbitrum.gnosis.io",
    43114: "https://safe-transaction.avalanche.gnosis.io",
    73799: "https://safe-transaction.volta.gnosis.io",
    1313161554: "https://safe-transaction.aurora.gnosis.io",
  },
  api: {
    OWNER_SAFES: (owner) => `${_baseApi()}/api/v1/owners/${owner}/safes/`,
    SAFE_DETAILS: (safe) => `${_baseApi()}/api/v1/safes/${safe}/`,
  },
};

const _baseApi = () => gnosis.baseapi[window.fucksapp.network.chainId];

module.exports = {
  headers,
  gnosis,
};
