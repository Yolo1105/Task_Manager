import React, { useEffect, useRef } from 'react';
import { Draggable } from '@fullcalendar/interaction';

const CalendarExEvents = ({ events }) => {
  const dragContainerRef = useRef(null);

  useEffect(() => {
    new Draggable(dragContainerRef.current, {
      itemSelector: '.drag-event',
      eventData: function(eventEl) {
        let title = eventEl.getAttribute('data-title');
        let duration = eventEl.getAttribute('data-duration');
        return { title, duration };
      }
    });
  }, [events]);

  return (
    <div ref={dragContainerRef}>
      {events.map((event, idx) => (
        <div key={idx} className="drag-event" data-title={event.title} data-duration={event.duration}>
          {event.title} ({event.tag})
        </div>
      ))}
    </div>
  );
};

export default CalendarExEvents;
