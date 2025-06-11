async function RepairMachine() {
    const mySN = prompt("Enter serial number:")
    let searchResults = await AppServer.searchInventory(mySN);
    
    if (searchResults.length != 1) {
        console.error("Expected 1 result for serial number " + mySN + ". Got " + searchResults.length);
        return;
    }
    const machine = searchResults[0];
    const activities = await machine.getAllActivities();
    
    let waits = [];
    for (let i = 0; i < Math.min(activities.length, 5); i++) {
        if (activities[i].IsComplete) continue;                 // change this so it only will mark it as complete if it's a message for repair
        waits.push( activities[i].markAsComplete() );
    }
    await Promise.all(waits);

    const repairNote = prompt("Enter repair note:");
    await machine.addPartsRepairNote(repairNote);

    alert("Success!");
}

let myButton = document.createElement("button");
myButton.innerHTML = "Repair Machine";
myButton.style.cssText = "position: absolute; bottom: 40px; right: 10px; z-index: 9999; padding: 15px;";
myButton.onclick = RepairMachine;
document.body.appendChild(myButton);