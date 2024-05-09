import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import LoginPage from "./LoginPage";
import ResultBoard from "./ResultBoard";
import Games from "./Games";

class App extends React.Component {
  state = {
    users: [],
      usualColor:"gray margin bounds"
  }

  render() {
    return (
        <div className="App">
          <Router>

                  <NavLink to="/" activeClassName="active" className={this.state.usualColor}>Home </NavLink>
                  {/*<NavLink to="/login" activeClassName="active" className={this.state.usualColor}>Login </NavLink>*/}
                  {/*<NavLink to="/super-admin" activeClassName="active" className={this.state.usualColor}>Super Admin </NavLink>*/}
                  <NavLink to="/result-board" activeClassName="active" className={this.state.usualColor}>Result Board </NavLink>
                  <NavLink to="/games" activeClassName="active" className={this.state.usualColor}>Games </NavLink>

            <Routes>
              <Route path="/" element={<LoginPage />} />
              {/*<Route path="/login" element={<LoginPage />} />*/}
              {/*<Route path="/super-admin" element={<SuperAdmin />} />*/}
                <Route path="/result-board" element={<ResultBoard />} />
                <Route path="/games" element={<Games />} />

            </Routes>
          </Router>
        </div>
    );
  }
}

export default App;
