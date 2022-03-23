import logo from "./logo.svg";
import "./App.css";
import Login from "./modules/Login";
import Dashboard from "./modules/Dashboard";

import DataBridge from "./helpers/DataBridge";

function App() {
  window.fucksapp = {};
  window.fucksapp.databridge = new DataBridge();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div>
        <Login postLogin={<Dashboard />} />
      </div>
    </div>
  );
}

export default App;
