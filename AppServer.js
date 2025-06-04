class Machine {
    constructor(json) {
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                this[key] = json[key];
            }
        }
        this["RentableInventoryItemStatusTypeName"] = {
            "11" : "Acquisition",
            "1" : "Active",
            "9" : "Converted to purchase",
            "12" : "Discontinued",
            "10" : "Equipment Recovery",
            "13" : "Lost by Acquisition",
            "2" : "Lost by distributor",
            "3" : "Lost by Kinex",
            "8" : "Retired from CPAv2",
            "7" : "Returned to vendor",
            "5" : "Unrecoverable from facility",
            "4" : "Unrecoverable from patient",
            "6" : "Unrepairable"
        }[json.RentableInventoryItemStatusTypeId];
    }
    async addPartsRepairNote(note) {
        const res = await AppServer.rawRequest('activities/add-activity', {
            "ActivityTypeName": "Parts Repair",
            "ActivityTypeId": "82",
            "FollowUpDate": "",
            "OwnedBy": "",
            "Note": note,
            "ActivityGroupId": "2",
            "ReferenceId": this.RentableInventoryItemId
        });
        return res;
    }
    async getAllActivities() {
        const res = await AppServer.rawRequest('activities/get', {
            ActivityGroupId : "2",
            ReferenceId : this.RentableInventoryItemId
        });
        for (let i = 0; i < res.records.length; i++) {
            res.records[i] = new Activity( res.records[i] );
        }
        return res.records;
    }
}
class Activity {
    constructor(json) {
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                this[key] = json[key];
            }
        }
        this.AppServerTitle = `🏴 ${this.ActivityTypeName}, ${this.IsComplete?"Complete, ":""}${this.getFollowUpDate()}, Modified: ${(new Date(this.ModifiedDate)).toLocaleDateString('en-US')}, Owner: ${this.OwnedByName}`;
    }
    markAsComplete(yesOrNo=true) {
        return AppServer.rawRequest('activities/update-activity-is-complete', {
            "ActivityId": this.ActivityId,
            IsComplete: (yesOrNo?"1":"0")
        });
    }
    getFollowUpDate() {
        if (!this.FollowUpDate || this.FollowUpDate.trim() === "") {
            return "No Follow Up";
        }
        const today = new Date();
        const d2 = new Date( this.FollowUpDate );
        const diffTime = Math.abs(d2 - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (d2 < today) {
            return "Expired";
        } else if (diffDays === 0) {
            return "Follow Up: Today";
        } else {
            return `Follow Up: ${diffDays}d`;
        }
    }
}
class AppServer {

    static async searchInventory(SN) {
        const inventoryRes = await AppServer.rawRequest('inventory-maintenance/search-inventory', {
            "SerialNumber" : SN
        });

        let out = [];
        for (let i = 0; i < inventoryRes.records.length; i++) {
            out.push(new Machine(inventoryRes.records[i]));
        }
        return out;
    }

    static async rawRequest(action, json) {
        function jsonToFormData(json) {
            const formData = new FormData();
            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    const value = json[key];

                    if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob)) {
                        // Recursively append nested objects and arrays
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            }
            return formData;
        }

        const res = await fetch('https://appserver.kinexmedical.com/' + action, {
            method: 'POST',
            body: jsonToFormData(json)
        });

        return await res.json();
    }
}