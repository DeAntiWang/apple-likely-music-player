import React, { useState, useEffect, useContext } from "react";
import { getColorSet, rgb2str } from "../utils/utils";
import { distThresholdContext } from "../utils/context";

export default function Player(props) {
  // context
  const distThreshold = useContext(distThresholdContext);
  // state
  const [backColor, setBackColor] = useState("rgb(255,255,255)");
  const [foreColor, setForeColor] = useState("rgb(0,0,0)");
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);

  const onBtnClick = () => {
    if (paused) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  };

  const onTimeUpdate = (e) => {};

  useEffect(() => {
    // do something like getColorSet, setBackColor, setForeColor
    props.imgSrc &&
      getColorSet(props.imgSrc, distThreshold, (colorSet) => {
        setBackColor(rgb2str(colorSet.chairColor));
        setForeColor(rgb2str(colorSet.viceColor));
      });
  }, [props.imgSrc, distThreshold]);

  return (
    <React.Fragment>
      <div
        id="player-box"
        style={{ backgroundColor: backColor, color: foreColor }}
      >
        <div id="player-box__content">
          <div id="player-box__img">
            <img src={props.imgSrc} />
          </div>
          <div id="player-box__right-box">
            <div id="player-box__info-group">
              <h3 id="player-box__info-group__title">Title</h3>
              <h5 id="player-box__info-group__album">Album Name</h5>
            </div>
            <div id="player-box__controller">
              <div id="player-box__progress-bar">
                <div
                  id="player-box__progress-bar__progress"
                  style={{
                    backgroundColor: backColor,
                    width: `${progress}*100%`,
                  }}
                ></div>
                <div
                  id="player-box__progress-bar__progress-ball"
                  style={{ backgroundColor: foreColor, display: "none" }}
                ></div>
              </div>
              <button id="player-box__play-btn" onClick={onBtnClick}>
                play!
              </button>
            </div>
          </div>
        </div>
      </div>
      <audio
        id="player-audio"
        src={props.musicSrc}
        onTimeUpdate={onTimeUpdate}
      />
    </React.Fragment>
  );
}
