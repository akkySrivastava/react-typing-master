import React from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";

const Title = () => {
  return (
    <div className="page-title">
       <span className="page-title-bold">Typing</span>{" "}<FontAwesomeIcon size="lg" spin color="#61DBFB" icon={faReact} />{" "}
      <span className="page-title-bold">Master</span>
    </div>
  );
};

export default Title;
