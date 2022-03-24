import logo from "./logo.svg";
import "./App.css";
import Login from "./modules/Login";

import DataBridge from "./helpers/DataBridge";

function App() {
  window.fucksapp = {};
  window.fucksapp.databridge = new DataBridge();
  return (
    <div className="App">
      <div>
        <Login/>
      </div>
    </div>
  );
}

export default App;
