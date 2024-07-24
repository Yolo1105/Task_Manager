import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal, Box, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import './Calendar.css';

const Calendar = ({ events, setEvents }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', startHour: '', startMinute: '', endHour: '', endMinute: '' });
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);
  const realTimeLineRef = useRef(null);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const intervalId = setInterval(() => {
      updateRealTimeLine();
    }, 60000);

    // Initial call to position the line correctly
    updateRealTimeLine();

    return () => clearInterval(intervalId);
  }, []);

  const updateRealTimeLine = () => {
    if (!calendarRef.current) return;

    const calendarApi = calendarRef.current.getApi();
    if (!calendarApi.view || !calendarApi.view.el) return;

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const timeGrid = calendarApi.view.el.querySelector('.fc-timegrid-slot-label');
    if (!timeGrid) return;

    const timeSlotHeight = timeGrid.offsetHeight;
    const hourHeight = timeSlotHeight * 2; // Each hour is represented by 2 slots (30 minutes each)

    const offset = (currentHour * hourHeight) + (currentMinute * (hourHeight / 60));
    if (realTimeLineRef.current) {
      realTimeLineRef.current.style.top = `${offset}px`;
    }
  };

  const handleDateClick = (info) => {
    const startHour = info.date.getHours().toString().padStart(2, '0');
    const startMinute = info.date.getMinutes().toString().padStart(2, '0');
    const endHour = (info.date.getHours() + 1).toString().padStart(2, '0');
    const endMinute = info.date.getMinutes().toString().padStart(2, '0');
    setNewEvent({ title: '', startHour, startMinute, endHour, endMinute });
    setSelectedDate(info.dateStr);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setNewEvent({ title: '', startHour: '', startMinute: '', endHour: '', endMinute: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = () => {
    const { title, startHour, startMinute, endHour, endMinute } = newEvent;
    if (title && startHour && startMinute && endHour && endMinute) {
      const startDate = new Date(selectedDate + `T${startHour}:${startMinute}:00`);
      const endDate = new Date(selectedDate + `T${endHour}:${endMinute}:00`);
      const event = { title, start: startDate, end: endDate };
      setEvents([...events, event]);
      scheduleNotification(event);
      handleClose();
    } else {
      alert('Please fill out all fields.');
    }
  };

  const handleEventReceive = (info) => {
    const { event } = info;
    const newEvent = { 
      title: event.title,
      start: event.start,
      end: event.end,
      id: event.id
    };
    setEvents([...events, newEvent]);
    info.event.remove();
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

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          slotDuration={'00:15:00'}
          slotLabelInterval={'00:30:00'}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            meridiem: 'short'
          }}
          editable={true}
          selectable={true}
          events={events}
          dateClick={handleDateClick}
          eventReceive={handleEventReceive}
          eventClick={(info) => alert(`Event: ${info.event.title}, Time: ${info.event.start.toLocaleTimeString()} - ${info.event.end.toLocaleTimeString()}`)}
          datesSet={updateRealTimeLine} // Add this line to update the real-time line when the calendar is rendered
        />
        <div ref={realTimeLineRef} className="real-time-line"></div>
        <Modal
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
            <h2 id="simple-modal-title">Add New Event</h2>
            <TextField
              fullWidth
              margin="normal"
              name="title"
              label="Event Title"
              value={newEvent.title}
              onChange={handleInputChange}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="start-time-label">Start Time</InputLabel>
                  <Select
                    labelId="start-time-label"
                    name="startHour"
                    value={`${newEvent.startHour}:${newEvent.startMinute}`}
                    onChange={(e) => {
                      const [startHour, startMinute] = e.target.value.split(':');
                      setNewEvent({ ...newEvent, startHour, startMinute });
                    }}
                  >
                    {generateTimeOptions().map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="end-time-label">End Time</InputLabel>
                  <Select
                    labelId="end-time-label"
                    name="endHour"
                    value={`${newEvent.endHour}:${newEvent.endMinute}`}
                    onChange={(e) => {
                      const [endHour, endMinute] = e.target.value.split(':');
                      setNewEvent({ ...newEvent, endHour, endMinute });
                    }}
                  >
                    {generateTimeOptions().map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddEvent}
              sx={{ mt: 2 }}
            >
              Add Event
            </Button>
          </Box>
        </Modal>
      </div>
    </DndProvider>
  );
};

export default Calendar;
