import React, { useState } from 'react';
import Timer from './Timer';
import './MultiTimer.css';

const MultiTimer = () => {
  const [timers, setTimers] = useState([]);
  const [newTimerName, setNewTimerName] = useState('');

  const addTimer = () => {
    if (newTimerName.trim() !== '') {
      setTimers([...timers, { name: newTimerName, id: Date.now() }]);
      setNewTimerName('');
    }
  };

  const removeTimer = (id) => {
    setTimers(timers.filter(timer => timer.id !== id));
  };

  return (
    <div className="multi-timer-container">
      <h1>Multi Timer Application</h1>
      <div className="new-timer-form">
        <input
          type="text"
          value={newTimerName}
          onChange={(e) => setNewTimerName(e.target.value)}
          placeholder="Enter timer name"
          className="timer-name-input"
        />
        <button onClick={addTimer} className="add-timer-button">Add Timer</button>
      </div>
      <div className="timers-list">
        {timers.map(timer => (
          <div key={timer.id} className="timer-wrapper">
            <Timer name={timer.name} onRemove={() => removeTimer(timer.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiTimer;
