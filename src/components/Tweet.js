import moment from "moment";
import { useState } from "react";
import firebaseInstance from "../firebaseInstance";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
function Tweet({
  docId,
  tweet,
  timestamp,
  uid,
  name,
  isUpdated,
  updateTimestamp,
  isOwner,
  url,
  deleteFile,
  userURL,
  loadMyTweets,
}) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);
  const db = getFirestore(firebaseInstance);

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = window.confirm("정말 수정하실건가요?");
    if (!ok) return;

    if (newTweet.length <= 0) {
      alert("공백을 채워주세요");
      return;
    }
    //TODO: DB수정
    const docRef = doc(db, "tweets", docId);
    try {
      await updateDoc(docRef, {
        tweet: newTweet,
        updateTimestamp: Date.now(),
        isUpdated: true,
      });
    } catch (err) {
      alert("업데이트에 실패했습니다");
    } finally {
      setEditing(false);
      loadMyTweets();
    }
  };
  const onChange = (e) => {
    setNewTweet(e.target.value);
  };
  const handleDelete = async () => {
    const ok = window.confirm("정말 삭제하실건가요?");
    if (!ok) return;

    await deleteDoc(doc(db, "tweets", docId));
    deleteFile(url);
    loadMyTweets();
  };
  return (
    <div className="tweet-box">
      {editing ? (
        <form onSubmit={onSubmit} className="tweet">
          <div className="content">
            <div className="meta">
              <p>작성자:{name}</p>
              <p className="timestamp">
                직성일: {moment(timestamp).format("h:mm a · YYYY/MM/DD")}
              </p>
            </div>
            <input
              type="text"
              value={newTweet}
              onChange={onChange}
              placeholder="what is your new tweet?"
              className="text"
            />
          </div>
          <div className="option edit-option">
            <input type="submit" value="수정하기" />
            <button onClick={() => setEditing((prev) => !prev)}>취소</button>
          </div>
        </form>
      ) : (
        <div className="tweet">
          <div className="content">
            <div className="meta">
              <p>작성자:{name}</p>
              {isUpdated ? (
                <p className="timestamp">
                  {`${moment(updateTimestamp).format(
                    "h:mm a · YYYY/MM/DD"
                  )} 수정됨`}
                </p>
              ) : (
                <p className="timestamp">{`${moment(timestamp).format(
                  "h:mm a · YYYY/MM/DD"
                )}`}</p>
              )}
            </div>
            <h2 className="text">{tweet}</h2>
            {url !== "" ? (
              <div className="pre-img">
                <img src={url} alt="photo" width="100%" height="100%" />
              </div>
            ) : null}
          </div>
          {isOwner ? (
            <div className="option">
              <button onClick={() => setEditing((prev) => !prev)}>수정</button>
              <button onClick={handleDelete}>삭제</button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Tweet;

// <div className="tweet">
//           <div className="content">
//             <div className="meta">
//               <p>작성자:{name}</p>
//               {isUpdated ? (
//                 <p className="timestamp">
//                   {`${moment(updateTimestamp).format(
//                     "h:mm a · YYYY/MM/DD"
//                   )} 수정됨`}
//                 </p>
//               ) : (
//                 <p className="timestamp">{`${moment(timestamp).format(
//                   "h:mm a · YYYY/MM/DD"
//                 )}`}</p>
//               )}
//             </div>
//             <h2>{tweet}</h2>
//             <div className="pre-img">
//               <img src={url} alt="photo" width="100%" height="100%" />
//             </div>
//           </div>
