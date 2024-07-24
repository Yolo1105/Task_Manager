import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';
import CalendarInput from './CalendarInput';
import Sidebar from './Sidebar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleDateClick = (info) => {
    const title = prompt('Enter Event Title:');
    const startTime = prompt('Enter Start Time:');
    const endTime = prompt('Enter End Time:');
    if (title && startTime && endTime) {
      const startDate = new Date(info.dateStr + 'T' + startTime);
      const endDate = new Date(info.dateStr + 'T' + endTime);
      const newEvent = { title, start: startDate, end: endDate };
      setEvents([...events, newEvent]);
      scheduleNotification(newEvent);
    }
  };

  const handleEventReceive = (info) => {
    const { event } = info;
    // Assuming the dragged item contains necessary data
    const newEvent = { 
      title: event.title,
      start: event.start,
      end: event.end,
      id: event.id
    };
    setEvents([...events, newEvent]);
    info.event.remove(); // Optional: remove placeholder event after drop
  };

  const scheduleNotification = (event) => {
    const eventTime = new Date(event.start).getTime();
    const currentTime = new Date().getTime();
    const timeToEvent = eventTime - currentTime;

    if (timeToEvent > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Event Reminder', {
            body: `${event.title} at ${event.start.toLocaleTimeString()}`
          });
        }
      }, timeToEvent - 60000); // 1 minute before the event
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-container">
        <Sidebar events={events} />
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          slotDuration={'00:30:00'}
          slotLabelInterval={'00:30:00'}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          editable={true}
          selectable={true}
          events={events}
          dateClick={handleDateClick}
          eventReceive={handleEventReceive}
          eventClick={(info) => alert(`Event: ${info.event.title}, Time: ${info.event.start.toLocaleTimeString()} - ${info.event.end.toLocaleTimeString()}`)}
        />
      </div>
    </DndProvider>
  );
};

export default Calendar;
