import React, { useState } from 'react';

const CalendarInput = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [expectedTime, setExpectedTime] = useState('');
  const [actualTime, setActualTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      title,
      expectedTime,
      actualTime,
      start: new Date(),  // Default starting now
      end: new Date()     // Default ending an hour later
    });
    setTitle('');
    setExpectedTime('');
    setActualTime('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" />
      <input type="text" value={expectedTime} onChange={(e) => setExpectedTime(e.target.value)} placeholder="Expected Time (e.g., 2 hours)" />
      <input type="text" value={actualTime} onChange={(e) => setActualTime(e.target.value)} placeholder="Actual Time (e.g., 1.5 hours)" />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default CalendarInput;
