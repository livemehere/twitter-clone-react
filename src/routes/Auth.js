import React from "react";
import firebaseApp from "../firebaseInstance";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import google from "../google.png";
import tweeterIcon from "../tweet-icon.png";

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
    <div className="container">
      <img src={tweeterIcon} className="tweet-icon" />
      <h1>지금 일어나고 있는 일</h1>
      <form onSubmit={signInEmailUser} className="login-form">
        <input type="email" placeholder="Email" name="email" required />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
        />
        <input type="submit" value="이메일 로그인" />
      </form>
      <form onSubmit={createEmailUser} className="login-form secondForm">
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
        <button onClick={googleLogin} className="google-btn">
          <img src={google} width="16" />
          <span style={{ paddingLeft: "5px" }}> 구글로 로그인</span>
        </button>
      </div>
    </div>
  );
}

export default Auth;
