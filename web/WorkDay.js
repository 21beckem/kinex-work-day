class WorkDay {
    static async rawRequest() {
        await new Promise(r => setTimeout(r, 100)); // simulate waiting for request
        
        let out = localStorage.getItem('KinexWorkDay_'+arguments[0]); // getting value
        if (arguments.length > 1) {
            out = localStorage.setItem('KinexWorkDay_'+arguments[0], JSON.stringify(arguments[1])); // setting value
        }
        try { out = JSON.parse(out); } catch (e) {}
        return out;
    }
    static async getAllCleaner() {
        let res = await WorkDay.rawRequest('all-cleaned');
        if (typeof res !== 'object' || !res) res = [];
        return res;
    }
    static async addCleaner(Sn, Status, date=null) {
        let data = await WorkDay.getAllCleaner();
        if (!data) data = [];
        if (!date) date = new Date();
        data.push([new Date().getTime(), Sn, Status]);
        return await WorkDay.rawRequest('all-cleaned', data);
    }
    static statusToIcon = (x) => { return { "-1": "🔩", "0": "⌛", "1": "✅" }[String(x)]; }
    static iconToStatus = (x) => { return { "🔩":  -1 , "⌛":  0 , "✅":  1  }[x]; }
}