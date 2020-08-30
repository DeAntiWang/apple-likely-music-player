import React, { useState, useEffect } from "react";
import Player from "../component/player";
import { distThresholdContext } from "../utils/context";

export default function Index() {
  const [distThreshold, setDistThreshold] = useState(0.25);
  const [imgId, setImgId] = useState("");

  const onInputChange = (e) => {
    setDistThreshold(e.target.value);
  };

  useEffect(() => {
    const match = window.location.search.match(/s=(\d+)/);
    if (match && match[1] !== undefined) {
      setImgId(`http://localhost:8000/source/img/${match[1]}.jpg`);
    }
  }, []);

  return (
    <div>
      <distThresholdContext.Provider value={Number(distThreshold)}>
        <Player
          title="Sharuru"
          album="Ablum Name"
          imgSrc={imgId}
          musicSrc={"http://localhost:8000/source/music/sharuru.mp3"}
        />
      </distThresholdContext.Provider>
      <input value={distThreshold} onChange={onInputChange} />
    </div>
  );
}
