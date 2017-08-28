/******************************************
 *  Author : Harsh Jagdishbhai Kevadia   
 *  Created On : Mon Aug 14 2017
 *  File : users.js
 *******************************************/
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let exportedMethods = {
    getUserByEmail(email) {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ email: email }).then((user) => {
                if (!user) throw "Email not found in DB";
                return user;
            });
        });
    },
    getUserById(id) {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: id }).then((user) => {
                if (!user) throw "User not found";
                return user;
            });
        });
    },
    addUser(firstName, lastName, address, contactNumber, state, city, zipCode, email, password) {
        return users().then((usersCollection) => {
            let newUser = {
                _id: uuid(),
                firstName: firstName,
                lastName: lastName,
                address: address,
                contactNumber: contactNumber,
                state: state,
                city: city,
                zipCode: zipCode,
                email: email,
                hashedPassword: bcrypt.hashSync(password, saltRounds)
            };

            return usersCollection.insertOne(newUser).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getUserById(newId);
            });
        });
    },
    removeUser(id) {
        return users().then((usersCollection) => {
            return usersCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not found user with id of ${id}`)
                }
            });
        });
    },
    updateUserInfo(id, updatedUserInfo) {
        return this.getUserById(id).then((currentUserInfo) => {
            let updatedInfo = {};
            if ('firstName' in updatedUserInfo) {
                updatedInfo.firstName = updatedUserInfo.firstName;
            }
            if ('lastName' in updatedUserInfo) {
                updatedInfo.lastName = updatedUserInfo.lastName;
            }
            if ('address' in updatedUserInfo) {
                updatedInfo.address = updatedUserInfo.address;
            }
            if ('contactNumber' in updatedUserInfo) {
                updatedInfo.contactNumber = updatedUserInfo.contactNumber;
            }
            if ('state' in updatedUserInfo) {
                updatedInfo.state = updatedUserInfo.state;
            }
            if ('city' in updatedUserInfo) {
                updatedInfo.city = updatedUserInfo.city;
            }
            if ('zipCode' in updatedUserInfo) {
                updatedInfo.zipCode = updatedUserInfo.zipCode;
            }
            if ('email' in updatedUserInfo) {
                updatedInfo.email = updatedUserInfo.email;
            }
            if ('password' in updatedUserInfo) {
                updatedInfo.hashedPassword = bcrypt.hashSync(updatedUserInfo.password, saltRounds);
            }

            let updateCommand = {
                $set: updatedInfo
            };

            return users().then((usersCollection) => {
                return usersCollection.updateOne({ _id: id }, updateCommand).then(() => {
                    return this.getUserById(id);
                });
            });
        });
    }
}
module.exports = exportedMethods;

/* exportedMethods.addUser("Harsh", "Kevadia", "3158 John F Kennedy Blvd", "502-294-8180", "NJ", "Jersey City", "07306", "hkevadia@stevens.edu", "Harsh7894").then((data) => {
    console.log(data);
});  */

/* exportedMethods.removeUser('b116019d-314d-4519-9a45-16dc0bac74e2').then(() => {
    console.log("Removed");
}); */
/* let data = {
    firstName: "H J",
    lastName: "K",
    address: "JFK Blvd",
    contactNumber: "800-045-7984",
    state: "CA",
    city: "Los Angeles",
    zipCode: "12345",
    email: "harshKevadia@stevens.edu",
    password: "Harsh-Gopi"
};
exportedMethods.updateUserInfo('fbee5da4-77a1-4923-a185-5043a63bd152', data).then((data) => {
    console.log(data);
}) */
/* exportedMethods.getUserByEmail("hkevadia@stevens.edu").then((data) => {
    console.log(data);
}); */