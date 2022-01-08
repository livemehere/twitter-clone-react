import { useEffect, useState } from "react";
import firebaseInstance from "../firebaseInstance";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import Tweet from "../components/Tweet";

function Home() {
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
    const querySnapshot = await getDocs(collection(db, "tweets"));

    querySnapshot.forEach((doc) => {
      let tweetObj = {
        docId: doc.id,
        ...doc.data(),
      };
      setTweets((prev) => [tweetObj, ...prev]);
    });
  };

  const addTweetToDB = async (tweet) => {
    try {
      await addDoc(collection(db, "tweets"), {
        uid: "test uid",
        tweet: tweet,
        timestamp: Date.now(),
      });
      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <h1>HOME</h1>
      <form onSubmit={onSubmit}>
        <input type="text" value={tweet} onChange={onChange} maxLength={100} />
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
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
