import React, { useState } from 'react';
import './App.css';
import Memo from './components/Memo';
import Timer from './components/Timer';

function App() {
  const [currentComponent, setCurrentComponent] = useState('timer');
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
    <div className="App">
      <header className="App-header">
        <h1>My Application</h1>
        <nav>
          <button onClick={() => setCurrentComponent('timer')}>Timer</button>
          <button onClick={() => setCurrentComponent('memo')}>Memo</button>
        </nav>
      </header>
      <main>
        {currentComponent === 'timer' ? (
          <div className="multi-timer-container">
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
        ) : (
          <Memo />
        )}
      </main>
    </div>
  );
}

export default App;
