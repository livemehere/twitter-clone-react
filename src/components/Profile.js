import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import firebaseInstance from "../firebaseInstance";
import Tweet from "../components/Tweet";
import logo from "../logo.png";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

const Profile = ({ user }) => {
  const db = getFirestore(firebaseInstance);
  const storage = getStorage(firebaseInstance);
  const tweetRef = collection(db, "tweets");
  const q = query(tweetRef, where("uid", "==", user.uid));
  const [tweets, setTweets] = useState([]);

  const [userName, setUserName] = useState(
    user.displayName == null ? "" : user.displayName
  );
  const [isEmailUser, setIsEmailUser] = useState(false);
  const auth = getAuth(firebaseInstance);
  useEffect(() => {
    if (!userName) {
      setIsEmailUser(true);
    }
    loadMyTweets();
  }, []);

  const loadMyTweets = async () => {
    const querySnapshot = await getDocs(q);
    const tweetArray = querySnapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));
    setTweets(tweetArray);
  };

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
        window.location.href = "/twitter-clone-react/";
      })
      .catch((error) => {
        // An error occurred
        // ...
        alert("업데이트에 실패했습니다");
      });
  };
  const deleteFile = async (url) => {
    await deleteObject(ref(storage, url));
  };

  return (
    <div className="container">
      <h1>
        {!isEmailUser
          ? `${user.displayName}의 Profile`
          : "이름과 프로필 사진을 등록해보세요!"}
      </h1>
      <form onSubmit={onSubmit} className="profile-form">
        <input
          type="text"
          placeholder="input your new name"
          value={userName}
          onChange={onChange}
          maxLength="50"
        />
        <input type="submit" value="변경하기" />
      </form>
      <div className="tweet-container">
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.docId}
            docId={tweet.docId}
            uid={tweet.uid}
            tweet={tweet.tweet}
            timestamp={tweet.timestamp}
            name={tweet.name}
            isUpdated={tweet.isUpdated}
            updateTimestamp={tweet.updateTimestamp}
            isOwner={user.uid === tweet.uid}
            url={tweet.url}
            deleteFile={deleteFile}
            loadMyTweets={loadMyTweets}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
