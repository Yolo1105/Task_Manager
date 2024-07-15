import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

const Timer = ({ name, onRemove }) => {
  const [seconds, setSeconds] = useState(0);
  const [inputValue, setInputValue] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [mode, setMode] = useState('countdown'); 
  const [targetDate, setTargetDate] = useState('');
  const [showMessage, setShowMessage] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      clearInterval(intervalRef.current);
      setIsActive(false);
      setHasEnded(true);
      alertUser();
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleTargetDateChange = (e) => {
    setTargetDate(e.target.value);
  };

  const startTimer = () => {
    let totalSeconds;
    if (mode === 'countdown') {
      totalSeconds = parseInt(inputValue.hours) * 3600 +
        parseInt(inputValue.minutes) * 60 +
        parseInt(inputValue.seconds);
    } else if (mode === 'datetime') {
      const target = new Date(targetDate);
      const now = new Date();
      totalSeconds = Math.floor((target - now) / 1000);
    }
    if (!isNaN(totalSeconds) && totalSeconds > 0) {
      setSeconds(totalSeconds);
      setIsActive(true);
      setHasEnded(false);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setSeconds(0);
    setIsActive(false);
    setHasEnded(false);
    setInputValue({ hours: 0, minutes: 0, seconds: 0 });
    setTargetDate('');
  };

  const formatTime = (seconds) => {
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const alertUser = () => {
    if (showMessage) {
      alert('Time is up!');
    }
  };

  return (
    <div className="timer-container">
      <h2>{name}</h2>
      <div className="timer-display">{formatTime(seconds)}</div>
      <div>
        <label>
          <input
            type="radio"
            name="mode"
            value="countdown"
            checked={mode === 'countdown'}
            onChange={() => setMode('countdown')}
          />
          Countdown
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="datetime"
            checked={mode === 'datetime'}
            onChange={() => setMode('datetime')}
          />
          Count till (from) date and time
        </label>
      </div>
      {mode === 'countdown' ? (
        <div className="time-inputs">
          <input
            type="number"
            name="hours"
            value={inputValue.hours}
            onChange={handleInputChange}
            placeholder="Hours"
          />
          <input
            type="number"
            name="minutes"
            value={inputValue.minutes}
            onChange={handleInputChange}
            placeholder="Minutes"
          />
          <input
            type="number"
            name="seconds"
            value={inputValue.seconds}
            onChange={handleInputChange}
            placeholder="Seconds"
          />
        </div>
      ) : (
        <input
          type="datetime-local"
          value={targetDate}
          onChange={handleTargetDateChange}
          className="datetime-input"
        />
      )}
      <div>
        <label>
          <input
            type="checkbox"
            checked={showMessage}
            onChange={() => setShowMessage(!showMessage)}
          />
          Show message
        </label>
      </div>
      <button onClick={startTimer} disabled={isActive} className="start-button">
        Start Timer
      </button>
      <button onClick={resetTimer} className="reset-button">
        Reset Timer
      </button>
      <button onClick={onRemove} className="remove-button">
        Remove Timer
      </button>
      {hasEnded && <div className="timer-alert">Time is up!</div>}
    </div>
  );
};

export default Timer;
