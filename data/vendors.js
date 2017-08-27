/******************************************
 *  Author : Ruchika Batukbhai Sutariya & Harsh Jagdishbhai Kevadia
 *  Created On : Mon Aug 14 2017
 *  File : vendors.js
 *******************************************/
const mongoCollections = require("../config/mongoCollections");
const vendors = mongoCollections.vendors;
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let exportedMethods = {
    getVendorByEmail(email) {
        return vendors().then((vendorsCollection) => {
            return vendorsCollection.findOne({ email: email }).then((vendor) => {
                if (!vendor) throw "Email not found in DB";
                return vendor;
            });
        });
    },
    getVendorById(id) {
        return vendors().then((vendorsCollection) => {
            return vendorsCollection.findOne({ _id: id }).then((vendor) => {
                if (!vendor) throw "Vendor not found";
                return vendor;
            });
        });
    },
    addVendor(saloonName, address, contactNumber, state, city, zipCode, email, password) {
        return vendors().then((vendorsCollection) => {
            let newVendor = {
                _id: uuid(),
                saloonName: saloonName,
                address: address,
                contactNumber: contactNumber,
                state: state,
                city: city,
                zipCode: zipCode,
                email: email,
                hashedPassword: bcrypt.hashSync(password, saltRounds)
            };

            return vendorsCollection.insertOne(newVendor).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getVendorById(newId);
            });
        });
    },
    removeVendor(id) {
        return vendors().then((vendorsCollection) => {
            return vendorsCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not found Vendor with id of ${id}`)
                }
            });
        });
    },
    updateVendorInfo(id, updatedVendorInfo) {
        return this.getVendorById(id).then((currentVendorInfo) => {
            let updatedInfo = {};
            if ('saloonName' in updatedVendorInfo) {
                updatedInfo.saloonName = updatedVendorInfo.saloonName;
            }
            if ('address' in updatedVendorInfo) {
                updatedInfo.address = updatedVendorInfo.address;
            }
            if ('contactNumber' in updatedVendorInfo) {
                updatedInfo.contactNumber = updatedVendorInfo.contactNumber;
            }
            if ('state' in updatedVendorInfo) {
                updatedInfo.state = updatedVendorInfo.state;
            }
            if ('city' in updatedVendorInfo) {
                updatedInfo.city = updatedVendorInfo.city;
            }
            if ('zipCode' in updatedVendorInfo) {
                updatedInfo.zipCode = updatedVendorInfo.zipCode;
            }
            if ('email' in updatedVendorInfo) {
                updatedInfo.email = updatedVendorInfo.email;
            }
            if ('password' in updatedVendorInfo) {
                updatedInfo.hashedPassword = bcrypt.hashSync(updatedVendorInfo.password, saltRounds);
            }

            let updateCommand = {
                $set: updatedInfo
            };

            return vendors().then((vendorsCollection) => {
                return vendorsCollection.updateOne({ _id: id }, updateCommand).then(() => {
                    return this.getVendorById(id);
                });
            });
        });
    },
    getReviewsFromReviewId(reviewId) {
        if (!reviewId)
            return Promise.reject("You must provide an ReviewID");
        return vendors().then((vendorsCollection) => {
            return vendorsCollection.findOne({ $where: "this.reviews._id = '" + reviewId + "'" }).then((data) => {
                if (!data)
                    throw "Reviews not Found !";
                let vendordata = data.reviews.filter(function (reviews) {
                    return reviews._id == reviewId;
                })[0];
                vendordata._id = data._id;
                vendordata.saloonName = data.saloonName;
                vendordata.address = data.address;
                vendordata.contactNumber = data.contactNumber;
                vendordata.state = data.state;
                vendordata.city = data.city;
                vendordata.zipCode = data.zipCode;
                vendordata.email = data.email;
                return vendordata;
            });
        });
    },
    addReviews(VendorId, userId, rating, reviews) {
        return vendors().then((vendorsReviewsCollection) => {
            reviewId = uuid();
            let addReviews = {
                _id: reviewId,
                userId: userId,
                rating: rating,
                reviews: reviews
            };
            return vendorsReviewsCollection.updateOne({_id: VendorId }, { $push: { "reviews": addReviews } }).then(function () {
                return exportedMethods.getReviewsFromReviewId(reviewId).then((data) => {
                    return data;
                }, (err) => {
                    return Promise.reject("Cannot add this reviews");
                });
            });
        });
    },
    removeReviews(reviewId) {
        return vendors().then((vendorsCollection) => {
            return vendorsCollection.updateOne(
                { "reviews._id": reviewId },
                { $unset: { "reviews.$._id": reviewId } }
            ).then((deletionInfo) => {
                if (deletionInfo.updatedCount === 0) {
                    throw (`Could not get reviews with id of ${reviewId}`)
                }
            });
        });
    },

    updateReviews(VendorId, reviewId, updateddata) {
        return this.getReviewsFromReviewId(reviewId).then((currentReview) => {
            if (!currentReview) throw "Reviews not found !";

            let reviewInfo = currentReview;
            if ('userId' in updateddata) {
                reviewInfo.userId = updateddata.userId;
            }
            if ('rating' in updateddata) {
                reviewInfo.rating = updateddata.rating;
            }
            if ('reviews' in updateddata) {
                reviewInfo.reviews = updateddata.reviews;
            }
            delete reviewInfo['vendorId'];
            delete reviewInfo['saloonName'];
            delete reviewInfo['address'];
            delete reviewInfo['contactNumber'];
            delete reviewInfo['state'];
            delete reviewInfo['city'];
            delete reviewInfo['zipcode'];
            delete reviewInfo['email'];
            let updateReviewdata = {
                $set: { "reviews.$": reviewInfo }
            };
            return vendors().then((vendorsCollection) => {
                return vendorsCollection.updateOne({ "reviews._id": reviewId }, updateReviewdata).then(() => {
                    return this.getReviewsFromReviewId(reviewId);
                });
            });
        });
    }

}
module.exports = exportedMethods;


/*exportedMethods.addReviews("24a95bf7-5a6e-4f98-8b25-240aa2184e30", "6392404c-7603-432d-8cb6-a2b496e02873", "5", "It is TOO good").then((data) => {
    console.log(data);
});
*/
 /*let updateddata = {
    rating: "6",
    reviews: "two",
    userId: "1234",
 }
exportedMethods.updateReviews("24a95bf7-5a6e-4f98-8b25-240aa2184e30", "9c74f2bb-3529-4c1d-b0a4-4db1d38e935a",updateddata).then((data) => {
    console.log(data);
});
*/
exportedMethods.getReviewsFromReviewId("9c74f2bb-3529-4c1d-b0a4-4db1d38e935a").then((data) => {
    console.log(data);
});

/* 
exportedMethods.addReviews("28f0ff0d-0302-4a4a-a31e-7c9ed20945ea", "72f74edd-499d-4056-bab4-5e092ba4d565", "5", "It is TOO good").then((data) => {
    console.log(data);
}); */


/*exportedMethods.addVendor("SalonX", "3588 John F Kennedy Blvd", "201-993-8891", "NJ", "Jersey City", "07307", "rsutariy@stevens.edu", "ruchika123").then((data) => {
    console.log(data);
});  

/*exportedMethods.removeVendor('62f794c8-b6cf-4bb7-be3a-a5283ac37ffc').then(() => {
    console.log("Removed");
}); 
 let data = {
    saloonName: "Ruchi",
    address: "JFK Blvd",
    contactNumber: "800-045-0000",
    state: "Ontario",
    city: "Windsor",
    zipCode: "12345",
    email: "rs@stevens.edu",
    password: "ruchika"
};
exportedMethods.updateVendorInfo('0b8bbd98-3981-47fa-bd2b-2b57f29054cb', data).then((data) => {
    console.log(data);
}) */
/* exportedMethods.getVendorByEmail("rsutariy@stevens.edu").then((data) => {
    console.log(data);
}); */
