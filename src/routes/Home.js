import { useEffect, useState } from "react";
import firebaseInstance from "../firebaseInstance";
import { v4 as uuidv4 } from "uuid";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Tweet from "../components/Tweet";

function Home({ user }) {
  const [tweet, setTweet] = useState("");
  const db = getFirestore(firebaseInstance);
  const storage = getStorage(firebaseInstance);
  const [photo, setPhoto] = useState("");
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preFile, setPreFile] = useState();
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    getTweetsFromDB();
  }, []);

  const upload = async (file, type, setLoading) => {
    const fileRef = ref(storage, `/tweetPhotos/${uuidv4()}.${type}`); //FIXME: 이건 Png말고 각자의 확장자로 변경해주기
    setLoading(true);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setLoading(false);
    setPreFile(null);
    return url;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (tweet.length <= 0) {
      alert("공백을 채워주세요!");
      return;
    }

    const url = await upload(photo, type, setIsLoading);
    await addTweetToDB(tweet, url);
    setType("");
    setTweet("");
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
    try {
      await addDoc(collection(db, "tweets"), {
        uid: user.uid,
        tweet: tweet,
        name: user.displayName,
        timestamp: Date.now(),
        isUpdated: false,
        updateTimestamp: Date.now(),
        url: url,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <h1>HOME</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={tweet}
          onChange={onChange}
          maxLength={100}
          placeholder="What's happening'"
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" />
        {preFile && (
          <div>
            <img src={preFile} alt="미리보기" width="50px" height="50px" />
            <button onClick={() => setPreFile(null)}>취소</button>
          </div>
        )}
      </form>
      <div>
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
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
