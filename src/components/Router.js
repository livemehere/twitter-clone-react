import React, { useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";
import NavBar from "./NavBar";

function Router({ isLoggedIn }) {
  return (
    <HashRouter>
      {isLoggedIn ? <NavBar /> : null}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/profile">
              <h1>Profile</h1>
            </Route>
          </>
        ) : (
          <Route exact path="/">
            <Auth />
          </Route>
        )}
      </Switch>
    </HashRouter>
  );
}

export default Router;
