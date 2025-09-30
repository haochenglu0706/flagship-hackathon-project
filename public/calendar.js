document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var selectedDate = null;
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        // navigate by single days
        headerToolbar: {
            left: 'prevDay,nextDay today',
            center: '',
            right: 'timeGridWeek,timeGridDay'
        },
        customButtons: {
            prevDay: {
                text: 'Prev',
                click: function () {
                    calendar.incrementDate({ days: -1 });
                }
            },
            nextDay: {
                text: 'Next',
                click: function () {
                    calendar.incrementDate({ days: 1 });
                }
            }
        },
        // keep selected/highlighted day in sync with current date
        datesSet: function () {
            selectedDate = calendar.getDate();
            // delay to ensure DOM is in place before applying highlight
            setTimeout(function(){ updateHighlight(selectedDate); }, 0);
        },
        dateClick: function (info) {
            selectedDate = info.date;
            updateHighlight(selectedDate);
        },
        dayHeaderFormat: { weekday: 'long' },
        views: {
            timeGridWeek: {
                dayHeaderFormat: { weekday: 'long' }
            },
            timeGridDay: {
                dayHeaderFormat: { weekday: 'long' }
            }
        }
    });
    calendar.render();
});

function updateHighlight(date) {
    if (!date) return;
    var ymd = toYmd(date);
    // clear previous
    document.querySelectorAll('.is-current').forEach(function(el){ el.classList.remove('is-current'); });
    // add to matching header cells and timegrid columns/background cells
    document.querySelectorAll('[data-date="' + ymd + '"]').forEach(function(el){ el.classList.add('is-current'); });
}

function toYmd(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
}