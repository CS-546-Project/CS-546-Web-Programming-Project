/******************************************
 *  Author : Harsh Jagdishbhai Kevadia   
 *  Created On : Sat Aug 26 2017
 *  File : hairCutters.js
 *******************************************/
const mongoCollections = require("../config/mongoCollections");
const hairCutters = mongoCollections.hairCutters;
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let exportedMethods = {
    gethairCutterById(id) {
        return hairCutters().then((hairCuttersCollection) => {
            return hairCuttersCollection.findOne({ _id: id }).then((hairCutter) => {
                if (!hairCutter) throw "HairCutter not found";
                return hairCutter;
            });
        });
    },
    addhairCutter(vendorId,firstName, lastName, heading, image, description) {
        return hairCutters().then((hairCuttersCollection) => {
            let newhairCutter = {
                _id: uuid(),
                vendorId: vendorId,
                firstName:firstName,
                lastName: lastName,
                heading:heading,
                image: image,
                description: description
            };

            return hairCuttersCollection.insertOne(newhairCutter).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.gethairCutterById(newId);
            });
        });
    },
    removehairCutter(id) {
        return hairCutters().then((hairCuttersCollection) => {
            return hairCuttersCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not found hairCutter with id of ${id}`)
                }
            });
        });
    },
    updatehairCutterInfo(id, updatedhairCutterInfo) {
        return this.gethairCutterById(id).then((currenthairCutterInfo) => {
            let updatedInfo = {};
            if ('vendorId' in updatedhairCutterInfo) {
                updatedInfo.vendorId = updatedhairCutterInfo.vendorId;
            }

            if ('firstName' in updatedhairCutterInfo) {
                updatedInfo.firstName = updatedhairCutterInfo.firstName;
            }
            if ('lastName' in updatedhairCutterInfo) {
                updatedInfo.lastName = updatedhairCutterInfo.lastName;
            }
            if ('heading' in updatedhairCutterInfo) {
                updatedInfo.heading = updatedhairCutterInfo.heading;
            }
            if ('image' in updatedhairCutterInfo) {
                updatedInfo.image = updatedhairCutterInfo.image;
            }
            if ('description' in updatedhairCutterInfo) {
                updatedInfo.description = updatedhairCutterInfo.description;
            }
            let updateCommand = {
                $set: updatedInfo
            };

            return hairCutters().then((hairCuttersCollection) => {
                return hairCuttersCollection.updateOne({ _id: id }, updateCommand).then(() => {
                    return this.gethairCutterById(id);
                });
            });
        });
    },
}
module.exports = exportedMethods;

/*exportedMethods.addhairCutter("0b8bbd98-3981-47fa-bd2b-2b57f29054cb","Ruchika","Sutariya", "heading", "image", "description").then((data) => {
    console.log(data);
});/* 
exportedMethods.removehairCutter('a8e5b375-a838-4dfd-8af8-f488dfecc089').then(() => {
    console.log("Removed");
});*/
/*exportedMethods.gethairCutterById('2f975e76-b30d-4311-9561-993f56751a93').then((data) => {
    console.log(data);
});*/

 /*let data = {
                vendorId:"0b8bbd98-3981-47fa-bd2b-2b57f29054cb",
                firstName:"Ruchi",
                lastName: "Sutariya1",
                heading:"heading1",
                image: "image1",
                description: "description1"
   
};
exportedMethods.updatehairCutterInfo('2f975e76-b30d-4311-9561-993f56751a93', data).then((data) => {
    console.log(data);
}) */
