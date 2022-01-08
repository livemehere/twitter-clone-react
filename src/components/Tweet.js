function Tweet({ docId, tweet, timestamp, uid }) {
  return (
    <div>
      <h3>docID:{docId}</h3>
      <h2>내용:{tweet}</h2>
      <p>시간:{timestamp}</p>
      <p>작성자:{uid}</p>
    </div>
  );
}

export default Tweet;
