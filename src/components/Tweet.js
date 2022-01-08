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
}) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);
  const db = getFirestore(firebaseInstance);

  const onSubmit = async (e) => {
    e.preventDefault();
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
    }
  };
  const onChange = (e) => {
    setNewTweet(e.target.value);
  };
  const handleDelete = async () => {
    await deleteDoc(doc(db, "tweets", docId));
  };
  return (
    <>
      {editing ? (
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              value={newTweet}
              onChange={onChange}
              placeholder="what is your new tweet?"
            />
            <p>직성일: {moment(timestamp).format("h:mm a · YYYY/MM/DD")}</p>
            <p>작성자:{name}</p>
          </div>
          <div>
            <input type="submit" value="수정하기" />
            <button onClick={() => setEditing((prev) => !prev)}>취소</button>
          </div>
        </form>
      ) : (
        <div>
          <div>
            <h2>{tweet}</h2>
            {isUpdated ? (
              <p>
                {`수정일:${moment(updateTimestamp).format(
                  "h:mm a · YYYY/MM/DD"
                )}`}
              </p>
            ) : (
              <p>{`작성일:${moment(timestamp).format(
                "h:mm a · YYYY/MM/DD"
              )}`}</p>
            )}
            <p>작성자:{name}</p>
          </div>
          {isOwner ? (
            <div>
              <button onClick={() => setEditing((prev) => !prev)}>수정</button>
              <button onClick={handleDelete}>삭제</button>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

export default Tweet;