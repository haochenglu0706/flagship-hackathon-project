async function getClasses(courseCode) {
  const res = await fetch(`http://localhost:3002/api/classes/${courseCode}`);
  const data = await res.json();
  console.log(data);
  return data; 
}

async function getFirstClassTime() {
    const listClasses = await getClasses("comp2521");
    const firstValidClass = listClasses.classes[1];
    const classTime = firstValidClass.times[0].time;
    i
}


// stores an array of classes
const listClasses = await getClasses("comp2521");
const firstValidClass = listClasses.classes[1];
const classTime = firstValidClass.times[0].time;
console.log("\n-------------\n");
console.log(firstValidClass);
console.log("\n-------------\n");
console.log(classTime);

