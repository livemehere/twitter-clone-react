import React from "react";
import { Link, useHistory } from "react-router-dom";
import firebaseApp from "../firebaseInstance";
import { getAuth, signOut } from "firebase/auth";

function NavBar() {
  const auth = getAuth(firebaseApp);
  const history = useHistory();
  const logout = () => {
    signOut(auth);
    history.push("/");
  };
  return (
    <nav>
      <div>
        <Link to="/">HOME</Link>
        <Link to="/profile">PROFILE</Link>
      </div>
      <button onClick={logout}>로그아웃</button>
    </nav>
  );
}

export default NavBar;
