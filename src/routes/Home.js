import { useEffect, useState } from "react";
import firebaseInstance from "../firebaseInstance";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
} from "firebase/firestore";
import Tweet from "../components/Tweet";

function Home({ user }) {
  const [tweet, setTweet] = useState("");
  const db = getFirestore(firebaseInstance);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    getTweetsFromDB();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    addTweetToDB(tweet);
    setTweet("");
  };
  const onChange = (e) => {
    setTweet(e.target.value);
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

  const addTweetToDB = async (tweet) => {
    try {
      await addDoc(collection(db, "tweets"), {
        uid: user.uid,
        tweet: tweet,
        name: user.displayName,
        timestamp: Date.now(),
        isUpdated: false,
        updateTimestamp: Date.now(),
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
          placeholder="What is on your mind?"
        />
        <input type="submit" />
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
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
