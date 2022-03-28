import { gnosis, headers } from "../../Constants";

const getChainId = () => {
  return window.fucksapp.network.chainId;
};

export default {
  getSafesForOwner: async (ownerAddress) => {
    const response = await fetch(`${gnosis.api[getChainId()]}/api/v1/owners/${ownerAddress}/safes/`, {
      method: "GET",
      headers: headers.acceptJson,
    });
    if (!response.ok) throw response;
    return (await response.json()).safes || [];
  },
  getSafeDetails: async (safeAddress) => {
    const response = await fetch(`${gnosis.api[getChainId()]}/api/v1/safes/${safeAddress}/`, {
      method: "GET",
      headers: headers.acceptJson,
    });
    if (!response.ok) throw response;
    return await response.json();
  },
};
