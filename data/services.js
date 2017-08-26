/******************************************
 *  Author : Harsh Jagdishbhai Kevadia   
 *  Created On : Sat Aug 26 2017
 *  File : services.js
 *******************************************/
/******************************************
 *  Author : Harsh Jagdishbhai Kevadia   
 *  Created On : Sat Aug 26 2017
 *  File : services.js
 *******************************************/
const mongoCollections = require("../config/mongoCollections");
const services = mongoCollections.services;
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let exportedMethods = {
    getServicesById(id) {
        return services().then((servicesCollection) => {
            return servicesCollection.findOne({ _id: id }).then((service) => {
                if (!service) throw "Service not found";
                return service;
            });
        });
    },
    addService(vendorId, serviceName, description, cost) {
        return services().then((servicesCollection) => {
            let newService = {
                _id: uuid(),
                vendorId:vendorId,
                serviceName: serviceName,
                description: description,
                cost: cost
            };

            return servicesCollection.insertOne(newService).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getServicesById(newId);
            });
        });
    },
    removeService(id) {
        return services().then((servicesCollection) => {
            return servicesCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not found Service with id of ${id}`)
                }
            });
        });
    },
    updateServiceInfo(id, updatedServiceInfo) {
        return this.getServicesById(id).then((currentServiceInfo) => {
            let updatedInfo = {};
            if ('serviceName' in updatedServiceInfo) {
                updatedInfo.serviceName = updatedServiceInfo.serviceName;
            }
            if ('description' in updatedServiceInfo) {
                updatedInfo.description = updatedServiceInfo.description;
            }
            if ('cost' in updatedServiceInfo) {
                updatedInfo.cost = updatedServiceInfo.cost;
            }
            let updateCommand = {
                $set: updatedInfo
            };

            return services().then((servicesCollection) => {
                return servicesCollection.updateOne({ _id: id }, updateCommand).then(() => {
                    return this.getServicesById(id);
                });
            });
        });
    },
}
module.exports = exportedMethods;

exportedMethods.addService("0b8bbd98-3981-47fa-bd2b-2b57f29054cb", "servicename", "description","cost").then((data) => {
    console.log(data);
}); 
