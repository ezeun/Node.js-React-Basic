import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  //Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import Auth from './hoc/auth'

function App() {
  const HOCLandingPage = Auth(LandingPage, null);
  const HOCLoginPage = Auth(LoginPage, false);
  const HOCRegisterPage = Auth(RegisterPage, false);

  return (
    <Router>
      <div>
        {/*
          A <Routes> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Routes> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Routes>
          <Route exact path="/"  element= {<HOCLandingPage/>}/>
          <Route exact path="/login" element= {<HOCLoginPage/>}/>
          <Route exact path="/register" element= {<HOCRegisterPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App