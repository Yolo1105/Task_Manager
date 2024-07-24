import React from 'react';
import { useDrag } from 'react-dnd';

const EventItem = ({ event }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "event",
    item: { id: event.id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {event.title} - Expected: {event.expectedTime} - Actual: {event.actualTime}
    </div>
  );
};

const Sidebar = ({ events }) => {
  return (
    <div>
      {events.map(event => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
};

export default Sidebar;
