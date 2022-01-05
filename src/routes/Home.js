import firebaseApp from "../firebaseInstance";
import { getAuth, signOut } from "firebase/auth";

function Home() {
  const auth = getAuth(firebaseApp);

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };
  return (
    <div>
      <nav>
        <button onClick={logout}>로그아웃</button>
      </nav>
      <h1>HOME</h1>
    </div>
  );
}

export default Home;
