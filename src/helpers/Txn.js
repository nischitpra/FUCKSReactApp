export default {
  sendTxn: async (contract, methodName, ...params) => {
    const unsingedTxn = await contract.populateTransaction[methodName](...params);
    return await window.fucksapp.wallet.getSigner().sendTransaction(unsingedTxn);
  },
};
