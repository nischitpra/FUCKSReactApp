import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ReactMarkdown from "react-markdown";

import DataBridge from "../helpers/DataBridge";
import Safe from "./Safe";

const Blog = () => {
  const fucksapp = window.fucksapp;
  const databridge = fucksapp.databridge;

  const TOKEN_ADDRESS = "0xc998dea8fbe6feeaa95a7c1099c41936ce42b7f5";
  const abi = ["function setBlog(string memory content) public", "function getBlog(address writer) public view returns (string memory)"];

  const initialState = {
    TOKEN_ADDRESS,
    blogContract: new ethers.Contract(TOKEN_ADDRESS, abi, fucksapp.wallet),
  };

  (new ethers.utils.Interface()).encodeFunctionData()

  /**
   * const masterContractAddress = '0x...';
const safeOwners: string[] =  ['0x...', '0x...', etc];
const threshold = 3;

// gnosisSafeAbi is the Gnosis Safe ABI in JSON format,
// you can find an example here: https://github.com/gnosis/safe-deployments/blob/main/src/assets/v1.1.1/gnosis_safe.json#L16
const gnosisInterface = new Interface(gnosisSafeAbi);
const safeSetupData = gnosisInterface.encodeFunctionData('setup', [
  safeOwners, 
  threshold,
  '0x0000000000000000000000000000000000000000',
  '0x',
  '0x0000000000000000000000000000000000000000',
  '0x0000000000000000000000000000000000000000',
  '0',
  '0x0000000000000000000000000000000000000000',
]);

// safeContractFactory is an instance of the "Contract" type from Ethers JS
// see https://docs.ethers.io/v5/getting-started/#getting-started--contracts
// for more details.
// You're going to need the address of a Safe contract factory and the ABI,
// which can be found here: https://github.com/gnosis/safe-deployments/blob/main/src/assets/v1.1.1/proxy_factory.json#L16
const proxy = await safeContractFactory.functions.createProxy(masterContractAddress, safeSetupData);
   */
  const [state, setState] = useState(initialState);

  useEffect(() => {
    databridge.sub(DataBridge.TOPIC.ACCOUNT_CHANGE, handleAccountChange);
    if (fucksapp.account) {
      handleAccountChange();
    }
  }, []);

  function resetState() {
    setState(initialState);
  }
  function updateState(update) {
    setState({ ...state, ...update });
  }

  async function handleAccountChange() {
    resetState();
    getBlog();
  }

  async function saveBlog() {
    const blog = document.getElementById("writeBlog").value;
    const unsingedTxn = await state.blogContract.populateTransaction.setBlog(blog);
    const res = await fucksapp.wallet.getSigner().sendTransaction(unsingedTxn);
    console.log(res);
    return blog;
  }

  async function getBlog() {
    const blog = await state.blogContract.getBlog(fucksapp.account);
    updateState({ blog });
    return blog;
  }

  function renderBlog() {
    return <ReactMarkdown children={state.blog} />;
  }

  return (
    <div>
      <h1>Blog</h1>
      <textarea id="writeBlog" />
      <button onClick={saveBlog}>Save Blog</button><br/>
      {renderBlog()}
    </div>
  );
};

export default Blog;
