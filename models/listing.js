const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
   
        image: {
            type: {
                filename: String,
                url: String,
            },
            set: (v) => {
                if (v === "" || !v) {
                    return {
                        filename: "defaultimage",
                        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                    };
                }
                return v;
            }
        },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;