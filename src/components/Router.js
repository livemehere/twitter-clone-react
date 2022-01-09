import React, { useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";
import NavBar from "./NavBar";
import Profile from "./Profile";

function Router({ isLoggedIn, user }) {
  return (
    <HashRouter>
      {isLoggedIn ? <NavBar /> : null}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home user={user} />
            </Route>
            <Route path="/profile">
              <Profile user={user} />
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
