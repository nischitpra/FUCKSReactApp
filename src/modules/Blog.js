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
