import React, { useState, useRef, useEffect } from "react";
import "./app.css";
import {
  TWO_MINUTES,
  ONE_SECOND,
  KEYCODE_BACKSPACE,
  KEYCODE_ENTER,
  PROGRESS_RING_STROKE,
  PROGRESS_RING_RADIUS,
} from "./utils/constants";
import {
  getStats,
  getHighlightClass,
  getCharByCode,
  getProgress,
  getInitialGameState,
  isUnusedKeyPress,
  getElapsedTime,
} from "./utils/helpers";

import Title from "./components/title";
import Stats from "./components/stats";
import Prompt from "./components/prompt";
import ProgressRing from './components/progress-ring'

let typingInterval;
let timeAtStart;

function App() {
  const typingArea = useRef(null);
  const [gameState, setGameState] = useState(getInitialGameState());
  const [timeElapsedInMs, setTimeElapsedInMs] = useState(0);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (hasStartedTyping && !isFinished) {
      timeAtStart = new Date();

      typingInterval = setInterval(() => {
        const newTimeElapsedInMs = getElapsedTime(timeAtStart);

        if (newTimeElapsedInMs >= TWO_MINUTES) {
          clearInterval(typingInterval);
          setIsFinished(true);
        } else {
          setTimeElapsedInMs(newTimeElapsedInMs);
        }
      }, ONE_SECOND);
    }

    return () => {
      clearInterval(typingInterval);
    };
  }, [isFinished, hasStartedTyping]);

  const {
    typingPrompt,
    correctEntries,
    incorrectEntries,
    isCorrectSequence,
    keyStrokeCount,
  } = gameState;

  const { wpm, accuracy } = getStats({
    timeElapsedInMs,
    correctEntries,
    incorrectEntries,
    keyStrokeCount,
  });

  const progress = getProgress({ timeElapsedInMs, isFinished });

  const highlightClass = getHighlightClass({ isCorrectSequence, isFinished });

  const handleOnKeyPress = ({ charCode }) => {
    setTimeElapsedInMs(getElapsedTime(timeAtStart));

    if (isUnusedKeyPress({ charCode, isFinished })) {
      return;
    }

    if (isFinished) {
      if (charCode === KEYCODE_ENTER) {
        setGameState(getInitialGameState());
        setIsFinished(false);
        setTimeElapsedInMs(0);
        setHasStartedTyping(false);
      }
      return;
    }

    if (!hasStartedTyping) {
      if (charCode === typingPrompt.charCodeAt(0)) {
        setHasStartedTyping(true);
      }
    }

    if (charCode === typingPrompt.charCodeAt(0) && isCorrectSequence) {
      setGameState({
        ...gameState,
        correctEntries: [...correctEntries, typingPrompt[0]],
        typingPrompt: typingPrompt.substring(1),
        isCorrectSequence: true,
        keyStrokeCount: keyStrokeCount + 1,
      });

      if (typingPrompt.substring(1).length < 1) {
        clearInterval(typingInterval);
        setIsFinished(true);
      }
    } else {
      setGameState({
        ...gameState,
        incorrectEntries: [...incorrectEntries, getCharByCode(charCode)],
        isCorrectSequence: false,
        keyStrokeCount: keyStrokeCount + 1,
      });
    }
  };

  const handleOnKeyDown = ({ keyCode }) => {
    if (isFinished) {
      return;
    }

    const handleHasIncorrectEntries = () => {
      setGameState({
        ...gameState,
        incorrectEntries:
          incorrectEntries.length > 0
            ? incorrectEntries.slice(0, -1)
            : incorrectEntries,
        isCorrectSequence: incorrectEntries.length <= 1,
      });
    };

    const handleCorrectEntries = () => {
      const updatedCorrectEntries = correctEntries.slice(0, -1);
      const updatedTypingPrompt = [
        correctEntries[correctEntries.length - 1],
        ...typingPrompt,
      ].join("");

      setGameState({
        ...gameState,
        correctEntries: updatedCorrectEntries,
        typingPrompt: updatedTypingPrompt,
      });
    };

    if (keyCode === KEYCODE_BACKSPACE) {
      const hasIncorrectEntries = incorrectEntries.length > 0;
      const hasCorrectEntries = correctEntries.length > 0;

      if (hasIncorrectEntries) {
        handleHasIncorrectEntries();
      } else if (hasCorrectEntries) {
        handleCorrectEntries();
      }
    }
  };

  const handleClick = () => {
    typingArea.current.focus();
  };

  return (
    <div onClick={handleClick} className="app">
      <input
        ref={typingArea}
        className="typing-area"
        onKeyPress={handleOnKeyPress}
        onKeyDown={handleOnKeyDown}
        type="text"
        autoFocus
      />
      <div className="app-container">
        <Title />
        <Prompt
          correctEntries={correctEntries}
          typingPrompt={typingPrompt}
          incorrectEntries={incorrectEntries}
          highlightClass={highlightClass}
          hasStartedTyping={hasStartedTyping}
          isFinished={isFinished}
        />
        <div className="row">
          
          <div className="column mt-10-negative">
            {/* <CountdownCircleTimer 
              isPlaying={hasStartedTyping}
              duration={120}
              isSmoothColorTransition={true}
            /> */}
            <ProgressRing
              hasStartedTyping={hasStartedTyping}
              isFinished={isFinished}
              stroke={PROGRESS_RING_STROKE}
              radius={PROGRESS_RING_RADIUS}
              progress={progress}
            />
          </div>
          {
            isFinished && <div className="column">
            <Stats
              hasStartedTyping={hasStartedTyping}
              isFinished={isFinished}
              wpm={wpm}
              accuracy={accuracy}
            />
          </div>
          }  
        </div>
      </div>
    </div>
  );
}

export default App;
