import logo from "./logo.svg";
import "./App.css";
import FUCKSToken from "./modules/FUCKSToken";
import Safe from "./modules/Safe";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div>
        <Safe />
        <FUCKSToken />
      </div>
    </div>
  );
}

export default App;
