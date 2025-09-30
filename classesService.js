export async function getClasses(courseCode) {
    try {
        const res = await fetch(`http://localhost:3002/api/classes/${courseCode}`);
        if (!res.ok) {
            return { error: `HTTP ${res.status}` };
        }
        const data = await res.json();
        console.log(data);
        return data;
    } catch(e) {
        return { error: e.message };
    }
}

export async function getFirstClassTime() {
    const listClasses = await getClasses("comp2521");
    const firstValidClass = listClasses.classes[1];
    const classTime = firstValidClass.times[0].time;
    // format to the appropriate time format e.g. 2025-09-29T12:30:00-05:00

    return classTime;
}


// stores an array of classes
const listClasses = await getClasses("comp2521");
const firstValidClass = listClasses.classes[1];
const classTime = firstValidClass.times[0].time;
console.log("\n-------------\n");
console.log(firstValidClass);
console.log("\n-------------\n");
console.log(classTime);

