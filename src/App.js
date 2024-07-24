import React, { useState } from 'react';
import './App.css';
import Memo from './components/Memo';
import Timer from './components/Timer';
import Calendar from './components/Calendar';
import CalendarInput from './components/CalendarInput';
import CalendarExEvents from './components/CalendarExEvents';

function App() {
  const [currentComponent, setCurrentComponent] = useState('timer');
  const [events, setEvents] = useState([]);

  // Function to check for duplicates based on title and start time
  const isDuplicateEvent = (newEvent) => {
    return events.some(event =>
      event.title === newEvent.title &&
      event.start.getTime() === newEvent.start.getTime()
    );
  };

  const handleCreateEvent = (event) => {
    if (!isDuplicateEvent(event)) {
      setEvents([...events, event]);
    } else {
      alert('Duplicate event detected. The event was not added.');
    }
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case 'timer':
        return <Timer />;
      case 'memo':
        return <Memo />;
      case 'calendar':
        return (
          <div>
            <CalendarInput onCreate={handleCreateEvent} />
            <CalendarExEvents events={events} />
            <Calendar events={events} />
          </div>
        );
      default:
        return <div>Please select a component from the header.</div>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager</h1>
        <nav>
          <button onClick={() => setCurrentComponent('timer')}>Timer</button>
          <button onClick={() => setCurrentComponent('memo')}>Memo</button>
          <button onClick={() => setCurrentComponent('calendar')}>Calendar</button>
        </nav>
      </header>
      <main>
        {renderComponent()}
      </main>
    </div>
  );
}

export default App;
