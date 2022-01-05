import React from "react";
import firebaseApp from "../firebaseInstance";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function Auth() {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();

  const googleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };
  const createEmailUser = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage, errorCode);
        alert(errorMessage);
      });
  };
  const signInEmailUser = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage, errorCode);
        alert(errorMessage);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={signInEmailUser}>
        <input type="email" placeholder="Email" name="email" required />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
        />
        <input type="submit" value="이메일 로그인" />
      </form>
      <form onSubmit={createEmailUser}>
        <input type="email" placeholder="new Email" name="email" required />
        <input
          type="password"
          placeholder="new Password"
          name="password"
          required
        />
        <input type="submit" value="이메일 회원가입" />
      </form>
      <div>
        <button onClick={googleLogin}>구글로 로그인</button>
      </div>
    </div>
  );
}

export default Auth;
