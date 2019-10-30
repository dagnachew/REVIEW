var mongoose = require("mongoose");
var Review = require("./models/review");
var Comment   = require("./models/comment");
 
var data = [
    {
        title: "Product Review 1", 
        image: "https://images.unsplash.com/photo-1461988091159-192b6df7054f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        review: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        title: "Product Review 2", 
        image: "https://images.unsplash.com/photo-1461988279488-1dac181a78f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        review: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        title: "Product Review 3", 
        image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        review: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
]
 
function seedDB(){
   //Remove all reviews
   Review.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed reviews!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few reviews
            data.forEach(function(seed){
                Review.create(seed, function(err, review){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a review");
                        //create a comment
                        Comment.create(
                            {
                                text: "This product is great, but I wish it was a little bit bigger",
                                author: "Henry"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    review.comments.push(comment);
                                    review.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;

