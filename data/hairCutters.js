/******************************************
 *  Author : Ruchika Batukbhai Sutariya   
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
    addhairCutter(vendorId, firstName, lastName, heading, image, description) {
        return hairCutters().then((hairCuttersCollection) => {
            let newhairCutter = {
                _id: uuid(),
                vendorId: vendorId,
                firstName: firstName,
                lastName: lastName,
                heading: heading,
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
    getReviewsFromReviewId(reviewId) {
        if (!reviewId)
            return Promise.reject("You must provide an ReviewID");
        return hairCutters().then((hairCuttersCollection) => {
            return hairCuttersCollection.findOne({ $where: "this.reviews._id = '" + reviewId + "'" }).then((data) => {
                if (!data)
                    throw "Reviews not Found !";
                let hairCutterdata = data.reviews.filter(function (reviews) {
                    return reviews._id == reviewId;
                })[0];
                hairCutterdata._id = data._id;
                hairCutterdata.vendorId = data.vendorId,
                    hairCutterdata.firstName = data.firstName,
                    hairCutterdata.lastName = data.lastName,
                    hairCutterdata.heading = data.heading,
                    hairCutterdata.image = data.image,
                    hairCutterdata.description = data.description
                return hairCutterdata;
            });
        });
    },
    addReviews(hairCutterId, userId, rating, reviews) {
        return hairCutters().then((hairCutterCollection) => {
            reviewId = uuid();
            let addReviews = {
                _id: reviewId,
                userId: userId,
                rating: rating,
                reviews: reviews
            };
            return hairCutterCollection.updateOne({ _id: hairCutterId }, { $push: { "reviews": addReviews } }).then(function () {
                return exportedMethods.getReviewsFromReviewId(reviewId).then((data) => {
                    return data;
                }, (err) => {
                    return Promise.reject("Cannot add this reviews");
                });
            });
        });
    },
    getAllReviewsFromHairCutterId(hairCutterId) {
        if (!hairCutterId)
            return Promise.reject("You must provide an ID");
        return hairCutters().then((hairCuttersCollection) => {
            return hairCuttersCollection.findOne({ _id: hairCutterId }).then((data) => {
                if (data === 'undefined')
                    throw "HairCutter not found !";
                let hairCutterdata = data.reviews;
                return hairCutterdata;
            });
        });
    },
}
module.exports = exportedMethods;




// exportedMethods.addhairCutter("626e9c5f-8792-484f-83d5-b05098661e77","Jai","Patel", "Hair Stylist", "stylist2.jpeg", "I have been working in a salon since I was 17. After a few years of shampooing and assisting many talented stylists, I decided that I wanted to be the one behind the chair. I started beauty school and while there I attended as many extra classes as I could.").then((data) => {
//     console.log(data);
// });


// exportedMethods.addReviews("94614a92-8543-472b-8cf1-21225ce98fa9", "c925049f-098e-4b00-8543-15c46e7617b6", "5", "It is TOO good").then((data) => {
//     console.log(data);
// });


//----------------Dummy Data---------------------------------------------------
/*exportedMethods.addReviews("c9d68e16-06f3-40e6-a0da-83cf85d56bf6", "455a942a-edaf-4b76-96a6-3491425a020a", "5", "It is TOO good").then((data) => {
    console.log(data);
});   
*/
/*exportedMethods.getReviewsFromReviewId("f60df383-d0a1-4332-9136-e3810f3f2f98").then((data) => {
    console.log(data);
}); 
*/
/*exportedMethods.getAllReviewsFromHairCutterId("c9d68e16-06f3-40e6-a0da-83cf85d56bf6").then((data) => {
    console.log(data);
}); 
*/

/*exportedMethods.removehairCutter('a8e5b375-a838-4dfd-8af8-f488dfecc089').then(() => {
    console.log("Removed");
});
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
