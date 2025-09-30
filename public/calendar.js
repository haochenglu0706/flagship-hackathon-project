import { getFirstClassTime } from "../classesService";

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',

        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        views: {
            timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
            },
            timeGridDay: {
                titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
            }
        }
    });


    calendar.addEvent({
        title: 'Event from app.js',
        start: '2025-09-29T12:30:00-05:00',
        end: '2025-09-29T12:30:00-03:00'
    });

    calendar.render();
});