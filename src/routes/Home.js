import { useEffect, useState } from "react";
import firebaseInstance from "../firebaseInstance";
import { v4 as uuidv4 } from "uuid";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Tweet from "../components/Tweet";
import attachment from "../attachment.png";
import cancel from "../cancel.png";

function Home({ user }) {
  const [tweet, setTweet] = useState("");
  const db = getFirestore(firebaseInstance);
  const storage = getStorage(firebaseInstance);
  const [photo, setPhoto] = useState("");
  const [type, setType] = useState("");
  const [preFile, setPreFile] = useState();
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    getTweetsFromDB();
  }, []);

  const upload = async (file, type) => {
    const fileRef = ref(storage, `/tweetPhotos/${uuidv4()}.${type}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setPreFile(null);
    return url;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (tweet.length <= 0) {
      alert("공백을 채워주세요!");
      return;
    }
    let url = "";
    if (photo !== "") {
      url = await upload(photo, type);
    }
    await addTweetToDB(tweet, url);
    setType("");
    setTweet("");
    setPhoto("");
  };
  const onChange = (e) => {
    setTweet(e.target.value);
  };

  const printFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (evt) {
      setPreFile(evt.target.result);
    };
  };

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setType(e.target.files[0].type.replace(/image\//, ""));
      printFile(e.target.files[0]);
    }
  };

  const getTweetsFromDB = async () => {
    const unsub = onSnapshot(collection(db, "tweets"), (querySnapshot) => {
      const tweetArray = querySnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });
  };

  const addTweetToDB = async (tweet, url) => {
    // FIXME: 그냥 이메일로 가입한 유저 에겐 비어있는내용이에요!

    let option = {
      uid: user.uid,
      tweet: tweet,
      name: user.displayName,
      timestamp: Date.now(),
      isUpdated: false,
      updateTimestamp: Date.now(),
      url: url,
    };
    try {
      await addDoc(collection(db, "tweets"), option);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const deleteFile = async (url) => {
    await deleteObject(ref(storage, url));
  };

  return (
    <div className="container">
      <h1>Kwitter</h1>
      <form onSubmit={onSubmit} className="tweet-form">
        <input
          type="text"
          value={tweet}
          onChange={onChange}
          maxLength={100}
          placeholder="What's happening'"
        />
        <div className="submit-box">
          <label htmlFor="inputFile">
            <img src={attachment} />
          </label>
          <input
            id="inputFile"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <input type="submit" value="Tweet" />
        </div>

        {preFile && (
          <div className="pre-img">
            <img src={preFile} alt="미리보기" width="100%" height="100%" />
            <button onClick={() => setPreFile(null)}>
              <img src={cancel} alt="" />
            </button>
          </div>
        )}
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
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
