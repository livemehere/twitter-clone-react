import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import firebaseInstance from "../firebaseInstance";
import logo from "../logo.png";

const Profile = ({ user }) => {
  const [userName, setUserName] = useState(
    user.displayName == null ? "" : user.displayName
  );
  const [isEmailUser, setIsEmailUser] = useState(false);
  const auth = getAuth(firebaseInstance);
  useEffect(() => {
    if (!userName) {
      setIsEmailUser(true);
    }
  }, []);

  const onChange = (e) => {
    setUserName(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    updateProfile(auth.currentUser, {
      displayName: userName,
    })
      .then(() => {
        // Profile updated!
        // ...
        alert("업데이트되었습니다!");
        window.location.href = "/";
      })
      .catch((error) => {
        // An error occurred
        // ...
        alert("업데이트에 실패했습니다");
      });
  };
  return (
    <div>
      <h1>
        {!isEmailUser
          ? `${user.displayName}의 Profile`
          : "이름과 프로필 사진을 등록해보세요!"}
      </h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="input your new name"
          value={userName}
          onChange={onChange}
          maxLength="50"
        />
        <input type="submit" value="변경하기" />
      </form>
    </div>
  );
};

export default Profile;
