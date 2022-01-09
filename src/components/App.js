import { useEffect, useState } from "react";
import Router from "./Router";
import firebaseApp from "../firebaseInstance";
import { auth, getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const auth = getAuth(firebaseApp);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          const uid = user.uid;
          setIsLoggedIn(true);
          setUser(user);
        } else {
          // User is signed out
          setIsLoggedIn(false);
        }
      },
      []
    );
  });

  return (
    <>
      <Router isLoggedIn={isLoggedIn} user={user} />
    </>
  );
}

export default App;
