document.addEventListener('DOMContentLoaded', async function () {

    // input bar
    let btn = document.getElementById("load-classes-btn");
    let input = document.getElementById("course-code");
    btn.onclick = function(){
        let pattern = /[A-Za-z]{4}[0-9]{4}$/
        if(!input.value.match(pattern)){
            // alert("Can't find the course!")
            input.value = "Not a valid course!";
            input.style.color = "#ff7878ff";
            return;
        }
        window.location.href = '/calendar?courseid=' + input.value.toUpperCase();
    }   

    input.onfocus = function(){
    input.value = ''
    input.style.color = 'var(--primary-color)'
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
        btn.click();
        }
    });
    }

    // calendar
    var calendarEl = document.getElementById('calendar');
    var selectedDate = null;
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',

        eventContent: function(arg) {
            // arg.event gives you the event object
            let location = arg.event.extendedProps.location;
            let classType = arg.event.extendedProps.classType;
        
            return {
              html: `
                <div>
                  <b>${arg.event.title}</b><br>
                  <i>${classType}</i><br>
                  <span>${location}</span>
                </div>
              `
            };
          },
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


    calendar.addEvent({
        title: 'Event from app.js',
        start: '2025-09-29T12:30:00-05:00',
        end: '2025-09-29T12:30:00-03:00'
    });

    const classesData = await loadClasses();
    const classes = classesData.classes;
    
    // Add events for each class and each time slot
    classes.forEach(classItem => {
            // Determine start and end times based on the logic you wanted
        if (classItem.activity === "Lecture") {
            classItem.times.forEach(time => {
                calendar.addEvent({
                    title: classItem.class_id,
                    startTime: time.time.split(' - ')[0],
                    endTime: time.time.split(' - ')[1],
                    daysOfWeek: [dayToNumber(time.day)],
                    extendedProps: {
                        location: time.location,
                        classType: classItem.activity,
                    }
                });
            })
        } else {
            let startTime, endTime;
            if ((classItem.times.length > 1) && (classItem.activity !== "Lecture")) {
                startTime = classItem.times[0].time.split(' - ')[0];
                endTime = classItem.times[1].time.split(' - ')[1];
            } else {
                startTime = classItem.times[0].time.split(' - ')[0]; // Extract start time
                endTime = classItem.times[0].time.split(' - ')[1];   // Extract end time
            }

            calendar.addEvent({
                title: classItem.class_id,
                startTime: startTime,
                endTime: endTime,
                daysOfWeek: [dayToNumber(classItem.times[0].day)],
                extendedProps: {
                    location: classItem.times[0].location,
                    classType: classItem.activity,
                    status: classItem.status,
                    capacity: classItem.course_enrolment,
                    weeks: classItem.times[0].weeks,
                    mode: classItem.mode
                }
            });
        }
        
    });
    calendar.render();
    
    // Load classes from URL parameter
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

function dayToNumber(day) {
    switch (day) {
        case "Mon":
            return 1;
        case "Tue":
            return 2;
        case "Wed":
            return 3;
        case "Thu":
            return 4;
        case "Fri":
            return 5;
        case "Sat":
            return 6;
        case "Sun":
            return 0;
        default:
            return 0;
    }
}

async function loadClasses() {
    const params = new URLSearchParams(window.location.search);
    const courseid = params.get('courseid');

    if (!courseid) {
        console.error('No courseid provided');
        return;
    }

    const res = await fetch(`/api/classes/${courseid}`);
    if (!res.ok) {
        console.error('Failed to load classes');
        return;
    }
    const data = await res.json();
    if (data.classes.length === 0) {
        console.error("Course not found");
    }
    console.log(data);
    console.log(data.classes.length);
    return data;
}