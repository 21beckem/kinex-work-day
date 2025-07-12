class WorkDay {
    constructor(role) {
        this.role = role;
    }
    async clear() {
        await new Promise(r => setTimeout(r, 100)); // simulate waiting for request
        return localStorage.removeItem('KinexWorkDay_'+this.role);
    }
    async getClaimed(convertToMachines=true) {
        await new Promise(r => setTimeout(r, 100)); // simulate waiting for request

        let res = localStorage.getItem('KinexWorkDay_'+this.role); // get value
        try { res = JSON.parse(res); } catch (e) {} // attempt to parse
        if (typeof res !== 'object' || !res) res = []; // ensure that it's an array

        if (!convertToMachines) return res; // return 2D array if requested

        return ClaimedMachine.convertFrom2dArray(res, this); // convert to machines
    }
    async addClaimed(Sn, Status, date=null) {
        await new Promise(r => setTimeout(r, 100)); // simulate waiting for request

        let data = await this.getClaimed(false); // get current data as 2D array
        if (!date) date = new Date(); // get current date
        data.push([new Date().getTime(), Sn, Status]); // add new row
        return localStorage.setItem('KinexWorkDay_'+this.role, JSON.stringify(data));
    }
}

class ClaimedMachine {
    constructor(row, i, myWorkDayObject) {
        this.Date = new Date(row[0]);
        this.SerialNumber = row[1];
        this.Status = row[2];
        this.StatusIcon = { "-1": "🔩", "0": "⌛", "1": "✅" }[String( this.Status )];
        this.myWorkDayObject = myWorkDayObject;
        this.index = i;
    }
    static convertFrom2dArray(data, myWorkDayObject) {
        return data.map((x, i) => new ClaimedMachine(x, i, myWorkDayObject));
    }
    toArray() {
        return [ this.Date.getTime(), this.SerialNumber, this.Status ];
    }
    async updateStatus(Status) {
        this.Status = Status;
        this.StatusIcon = { "-1": "🔩", "0": "⌛", "1": "✅" }[String( this.Status )];
        let arr2D = (await this.myWorkDayObject.getClaimed(false));
        arr2D[this.index] = this.toArray();
        localStorage.setItem('KinexWorkDay_'+this.myWorkDayObject.role, JSON.stringify(arr2D));
    }
    async delete() {
        let res = await this.myWorkDayObject.getClaimed();
        res.splice(this.index, 1);
        let arr2D = res.map(x => x.toArray());
        return localStorage.setItem('KinexWorkDay_'+this.myWorkDayObject.role, JSON.stringify(arr2D));
    }
}