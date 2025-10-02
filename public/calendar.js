document.addEventListener('DOMContentLoaded', async function () {

    // input bar
    let btn = document.getElementById("load-classes-btn");
    let input = document.getElementById("course-code");
    btn.onclick = function(){
        let pattern = /^[A-Za-z]{4}[0-9]{4}$/
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
        slotMinTime: '08:00:00',
        weekends: false,
        eventMaxStack: 4,
        slotEventOverlap: false,
        initialDate: '2025-08-25',
        eventOrder: function(a, b) {
            // First sort by priority (Open classes first)
            const priorityA = a.extendedProps.priority || 999;
            const priorityB = b.extendedProps.priority || 999;
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            // Then sort by title for consistent ordering
            return a.title.localeCompare(b.title);
        },

        eventContent: function(arg) {
            let props = arg.event.extendedProps;
            let statusColor = props.status === 'Open' ? '#4ade80' : '#f87171';
            let modeIcon = props.mode === 'Online' ? '🌐' : '🏫';
            let typeIcon = props.classType === 'Lecture' ? '📚' : props.classType === 'Tutorial' ? '👥' : '🔬';
            
            // Simplify class type names
            let shortClassType = '';
            if (props.classType === 'Lecture') {
                shortClassType = 'Lec';
            } else if (props.classType === 'Tutorial-Laboratory') {
                shortClassType = 'Tut-Lab';
            } else if (props.classType === 'Tutorial') {
                shortClassType = 'Tut';
            } else {
                shortClassType = props.classType;
            }
            
            // Extract building code from location (e.g., "Ainsworth G03 (K-J17-G03)" → "K-J17-G03")
            let shortLocation = props.location;
            let building;
            let room;
            if (props.location.includes('(') && props.location.includes(')')) {
                let match = props.location.match(/\(([^)]+)\)/);
                if (match) {
                    shortLocation = match[1]; // Use the full code in brackets
                    building = shortLocation.slice(0,5)
                    room = shortLocation
                    if (building === 'Quad ') {
                        building = 'K-E15'
                        let temp = shortLocation.slice(shortLocation.length -5, shortLocation.length)
                        temp = temp.trim()
                        room = 'K-E15' + '-' + temp
                    } 
                    if (building[building.length - 1] == '-') {
                        building = building.slice(0,4)
                    }
                }
            } else if (props.location === 'Online (ONLINE)') {
                shortLocation = 'Online';

            }
            if (shortLocation === 'ONLINE') {
                return {
                  html: `
                    <div class="fc-event-content">
                      <div class="event-header">
                        <span class="type-icon">${typeIcon}</span>
                        <span class="event-title">${arg.event.title} ${shortClassType}</span>
                      </div>
                      <div class="event-details">
                        <div class="detail-row">
                          <span class="detail-label">📍</span>
                          <span class="detail-value location">${shortLocation}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">●</span>
                          <span class="detail-value status" style="color: ${statusColor}">${props.status}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">👥</span>
                          <span class="detail-value">${props.capacity}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">📅</span>
                          <span class="detail-value weeks">${props.weeks}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">${modeIcon}</span>
                          <span class="detail-value mode">${props.mode}</span>
                        </div>
                        <div class="detail-row">
                          <span class="detail-label">🕐</span>
                          <span class="detail-value time">${props.time}</span>
                        </div>
                      </div>
                    </div>
                  `
                };
            }
            else {
                return {
                    html: `
                    <a  href="https://www.learningenvironments.unsw.edu.au/physical-spaces/${building}/${room}" target="_blank">
                      <div class="fc-event-content">
                        <div class="event-header">
                          <span class="type-icon">${typeIcon}</span>
                          <span class="event-title">${arg.event.title} ${shortClassType}</span>
                        </div>
                        <div class="event-details">
                          <div class="detail-row">
                            <span class="detail-label">📍</span>
                            <span class="detail-value location">${shortLocation}</span>
                          </div>
                          <div class="detail-row">
                            <span class="detail-label">●</span>
                            <span class="detail-value status" style="color: ${statusColor}">${props.status}</span>
                          </div>
                          <div class="detail-row">
                            <span class="detail-label">👥</span>
                            <span class="detail-value">${props.capacity}</span>
                          </div>
                          <div class="detail-row">
                            <span class="detail-label">📅</span>
                            <span class="detail-value weeks">${props.weeks}</span>
                          </div>
                          <div class="detail-row">
                            <span class="detail-label">${modeIcon}</span>
                            <span class="detail-value mode">${props.mode}</span>
                          </div>
                          <div class="detail-row">
                            <span class="detail-label">🕐</span>
                            <span class="detail-value time">${props.time}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                    `
                  };
            }
          },
        // navigate by single days
        headerToolbar: {
            left: 'prevDay,nextDay',
            center: '',
            right: 'timeGridWeek,timeGridDay'
        },
        customButtons: {
            prevDay: {
                text: 'Prev',
                click: function () {

                    if (String(calendar.getDate()).split(' ')[0] === "Mon") {
                        calendar.incrementDate({ days: 4 });
                    } else {
                        calendar.incrementDate({ days: -1 });
                    }
                }
            },
            nextDay: {
                text: 'Next',
                click: function () {
                    if (String(calendar.getDate()).split(' ')[0] === "Fri") {
                        calendar.incrementDate({ days: -4 });
                    } else {
                        calendar.incrementDate({ days: 1 });
                    }
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
            calendar.gotoDate(selectedDate);
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

    const classesData = await loadClasses();
    const classes = classesData.classes;
    const len = classes.length;
    const sortedArray = new Array(len);
    if (len > 0) {
        let i = 0;
        let j = 0;
        let k = len - 1;
        while (j <= k) {
            if (classes[i].status === "Open") {
                sortedArray[j] = classes[i];
                j++;
            } else {
                sortedArray[k] = classes[i];
                k--;
            }
            i++;
        }
    }
    // output  = []

    // for (let i = 0; i < classes.length; i ++) {
    //     if (classes[i].status === 'Open' ) {
    //         new_output =  output.splice(0, classes[i])
    //         output = new_output
    //     }
    //     else {
    //         output.push(classes[i])
    //     }
    // }

    // console.log(typeof(classes))
    // console.log(typeof(output))

    
    // Add events for each class and each time slot
    classes.forEach(classItem => {
        // Determine start and end times based on the logic you wanted
        let colour;
        let ratio = eval(classItem.course_enrolment);


        if (ratio === 1) {
            colour =  '#F72D2D' // red
        }
        else if (ratio >= 0.80 && ratio < 1) {
            colour = '#F59C27' // orange
        }
        else {
            colour = '#3987d8' // blue
        }

        if (classItem.activity === "Lecture") {
            classItem.times.forEach(time => {
                calendar.addEvent({
                    title: classItem.section,
                    startTime: time.time.split(' - ')[0],
                    endTime: time.time.split(' - ')[1],
                    daysOfWeek: [dayToNumber(time.day)],
                    backgroundColor: colour,
                    extendedProps: {
                        location: time.location,
                        classType: classItem.activity,
                        time: time.time,
                        status: classItem.status,
                        capacity: classItem.course_enrolment,
                        weeks: time.weeks,
                        mode: classItem.mode,
                        priority: classItem.status === 'Open' ? 1 : 2
                    }
                });
            })
        } else if (classItem.activity === "Tutorial-Laboratory") {
            let startTime, endTime;
            if ((classItem.times.length > 1) && (classItem.activity !== "Lecture")) {
                startTime = classItem.times[0].time.split(' - ')[0];
                endTime = classItem.times[1].time.split(' - ')[1];
                console.log(classItem.section + " " + endTime);
            } else {
                startTime = classItem.times[0].time.split(' - ')[0]; // Extract start time
                endTime = classItem.times[0].time.split(' - ')[1];   // Extract end time
            }
            
            // Create the correct time string for display
            let displayTime = startTime + ' - ' + endTime;
            
            console.log(classItem.section + " " + endTime);
            calendar.addEvent({
                title: classItem.section,
                startTime: startTime,
                endTime: endTime,
                daysOfWeek: [dayToNumber(classItem.times[0].day)],
                backgroundColor: colour,
                extendedProps: {
                    location: classItem.times[0].location,
                    classType: classItem.activity,
                    status: classItem.status,
                    capacity: classItem.course_enrolment,
                    weeks: classItem.times[0].weeks,
                    mode: classItem.mode,
                    time: displayTime,
                    priority: classItem.status === 'Open' ? 1 : 2
                }
            });
        } else {
            if (classItem.times.length > 1) {
                classItem.times.forEach(time => {
                    calendar.addEvent({
                        title: classItem.section,
                        startTime: time.time.split(' - ')[0],
                        endTime: time.time.split(' - ')[1],
                        daysOfWeek: [dayToNumber(time.day)],
                        backgroundColor: colour,
                        extendedProps: {
                            location: time.location,
                            classType: classItem.activity,
                            status: classItem.status,
                            capacity: classItem.course_enrolment,
                            weeks: time.weeks,
                            mode: classItem.mode,
                            priority: classItem.status === 'Open' ? 1 : 2
                        }
                    });
                })
            } else {
                if (classItem.times.length > 0) {
                    calendar.addEvent({
                        title: classItem.section,
                        startTime: classItem.times[0].time.split(' - ')[0],
                        endTime: classItem.times[0].time.split(' - ')[1],
                        daysOfWeek: [dayToNumber(classItem.times[0].day)],
                        backgroundColor: colour,
                        extendedProps: {
                            location: classItem.times[0].location,
                            classType: classItem.activity,
                            status: classItem.status,
                            capacity: classItem.course_enrolment,
                            weeks: classItem.times[0].weeks,
                            mode: classItem.mode,
                            priority: classItem.status === 'Open' ? 1 : 2
                        }
                    });
                }
            }
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
    return data;
}