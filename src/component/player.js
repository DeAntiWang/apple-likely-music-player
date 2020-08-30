import React, { useState, useEffect, useContext, useRef } from "react";
import { getColorSet, rgb2str } from "../utils/utils";
import { distThresholdContext } from "../utils/context";

export default function Player(props) {
  // ref
  const audioRef = useRef(null);
  // context
  const distThreshold = useContext(distThresholdContext);
  // state
  const [backColor, setBackColor] = useState("rgb(255,255,255)");
  const [foreColor, setForeColor] = useState("rgb(0,0,0)");
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);

  const boxColor = (color, opcation) => {
    return color.replace("rgb", "rgba").replace(")", `,${opcation || "0.9"})`);
  };

  const onBtnClick = () => {
    if (paused) {
      audioRef.current.play();
      setPaused(false);
    } else {
      audioRef.current.pause();
      setPaused(true);
    }
  };

  const onTimeUpdate = () => {
    setProgress(audioRef.current.currentTime / audioRef.current.duration);
  };

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
        style={{ backgroundColor: boxColor(backColor, 0.9), color: foreColor }}
      >
        <div id="player-box__content">
          <div id="player-box__img">
            <img src={props.imgSrc} />
          </div>
          <div id="player-box__right-box">
            <div id="player-box__info-group">
              <h3 id="player-box__info-group__title">
                {props.title || "Title"}
              </h3>
              <h5 id="player-box__info-group__album">
                {props.album || "Album Name"}
              </h5>
            </div>
            <div id="player-box__controller">
              <div id="player-box__progress-bar">
                <div
                  id="player-box__progress-bar__progress"
                  style={{
                    backgroundColor: foreColor,
                    width: `${progress * 100}%`,
                  }}
                ></div>
                <div
                  id="player-box__progress-bar__progress-ball"
                  style={{ backgroundColor: foreColor }}
                ></div>
              </div>
              <button
                id="player-box__play-btn"
                onClick={onBtnClick}
                style={{ backgroundColor: foreColor, color: backColor }}
              >
                play
              </button>
            </div>
          </div>
        </div>
      </div>
      <audio
        id="player-audio"
        ref={audioRef}
        src={props.musicSrc}
        preload="meta"
        onTimeUpdate={onTimeUpdate}
      />
    </React.Fragment>
  );
}
