import React from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBolt } from "@fortawesome/free-solid-svg-icons";

const ONE_HUNDRED = 100;
const TWO = 2;

const ProgressRing = ({
  radius,
  stroke,
  progress,
  hasStartedTyping,
  isFinished,
}) => {
  const normalizedRadius = radius - stroke * TWO;
  const circumference = normalizedRadius * TWO * Math.PI;

  const strokeDashoffset =
    circumference - (progress / ONE_HUNDRED) * circumference;

  const getStroke = () => {
    if (isFinished) {
      return "#c0ff33";
    }

    if (hasStartedTyping &&  progress >= 80) {
      return "#c0ff33";
    }
    
    if (hasStartedTyping && progress < 80 && progress >= 60) {
      return "#feff5c";
    }
    if (hasStartedTyping && progress < 60 && progress >= 40) {
      return "#ffc163";
    }

    if (hasStartedTyping && progress < 40 && progress >= 20) {
      return "#ffa879";
    }

    if (hasStartedTyping && progress < 20 && progress >= 0) {
      return "#fb4b4b";
    }


    return "#000";
  };



  return (
    <React.Fragment>
      <svg className="progress-ring" height={radius * TWO} width={radius * TWO}>
        <circle
          stroke={getStroke()}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{
            strokeDashoffset: strokeDashoffset ? strokeDashoffset : 0,
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="progress-check">
        {
          isFinished ? <FontAwesomeIcon
          icon={faCheck}
          color={getStroke()}
        /> : <span style={{color: getStroke()}}>{!isNaN(progress) ? progress : 100}</span>
        }
        
        
      </div>
    </React.Fragment>
  );
};

export default ProgressRing;
