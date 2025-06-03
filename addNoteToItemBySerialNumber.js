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

const SN = prompt('Serial Number:');

const form = jsonToFormData({
    "ProductName":"",
    "VendorName":"",
    "VendorItemName":"",
    "TerritoryName":"",
    "IsTransferRequested":"",
    "RequestedTerritoryName":"",
    "SerialNumber" : SN,   //      <-- Serial Number
    "IsRented":"",
    "NextCleanInspectionDateBefore":"",
    "NextCleanInspectionDateAfter":"",
    "LastCleanInspectionDateBefore":"",
    "LastCleanInspectionDateAfter":"",
    "IsConsigned":"",
    "ConsignedCustomerName":"",
    "IsInRecovery":"",
    "RentableInventoryItemPurchasedById":"",
    "PurchaseDateAfter":"",
    "PurchaseDateBefore":"",
    "RentableInventoryItemStatusTypeId":"1",
    "IsActivityTypeId":"1",
    "ActivityTypeId":"",
    "IsFollowUpNeeded":"",
    "FollowUpPerson":"",
    "OwnedByObjectGUID":"",
    "ActivityCreatedDateAfter":"",
    "ActivityCreatedDateBefore":"",
    "IsAttributeName":"1",
    "AttributeName":"",
    "IsAttributeValue":"1",
    "AttributeValue":"",
    "AttributeIsActive":"",
    "HasFormType":"1",
    "FormTypeId":"",
    "DocumentCreatedBy":"",
    "DocumentCreatedByObjectGUID":"",
    "DocumentModifiedBy":"",
    "DocumentModifiedByObjectGUID":"",
    "DocumentCreatedDateAfter":"",
    "DocumentCreatedDateBefore":"",
    "SortColumn":"RequestedTerritoryDate",
    "SortASC":"1",
    "PageNum":"0"
});
const response = await fetch('https://appserver.kinexmedical.com/inventory-maintenance/search-inventory', {
    method: 'POST',
    body: form
});
const results = await response.json();
console.log(results);

if (results.records.length == 1) {
    const note = prompt('Parts Repair note to add:');
    
    await fetch('https://appserver.kinexmedical.com/activities/add-activity', {
        method: 'POST',
        body: jsonToFormData({
            "ActivityTypeName": "Parts Repair",
            "ActivityTypeId": "82",
            "FollowUpDate": "",
            "OwnedBy": "",
            "Note": note,
            "ActivityGroupId": "2",
            "ReferenceId": results.records[0].RentableInventoryItemId
        })
    });
}
