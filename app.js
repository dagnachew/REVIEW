var express = require("express");
var app = express();
var exphbs = require('express-handlebars');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
var passport = require("passport");
var localStrategy = require("passport-local");
var expressSession = require("express-session");
var Review = require("./models/review");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");


// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

// Mongoose configuration
seedDB();
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/coffee_review";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var PORT = process.env.PORT || 3000;

// Passport
app.use(expressSession({
    secret: "Ben always get called first!",
    resave: false,
    saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ROUTES
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Index
app.get("/", function(req, res){
    res.render("index");
});

app.get("/reviews", function(req, res){

    // find all reviews
    Review.find({}, function(err, reviews){
        if(err){
            console.log(err);
        } else {
            res.render("reviews/reviews", {reviews: reviews, currentUser: req.user});
        }
    });
});

// Create and add review
app.post("/reviews", function(req, res){    
    //get data from user review
    var title = req.body.title;
    var image = req.body.image;
    var review = req.body.review;
    var created = req.body.created;
    var newReview = {title: title, image: image, review: review, created: created};
    
    Review.create(newReview, function(err, newnew){
        if(err){
            console.log(err);
        } else {
            //redirect to reviews page
            res.redirect("/reviews/reviews");
        }
    });
});

// New review/form view
app.get("/reviews/new", isSignedIn, function(req, res){
    res.render("reviews/new");
});

// Show review
app.get("/reviews/:id", function(req, res){
    Review.findById(req.params.id).populate("comments").exec(function(err, found){
        if(err){
            console.log(err)
        } else {
            res.render("reviews/show", {review: found});
        }
    })
});


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
// COMMENTS ROUTES
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get("/reviews/:id/comments/new", isSignedIn, function(req, res){
    //find review
    Review.findById(req.params.id, function(err, review){
        if(err){
            console.log(err);
        }else {
            res.render("comments/new", {review: review});
        }
    })
});

app.post("/reviews/:id/comments", isSignedIn, function(req, res){
    // search
    Review.findById(req.params.id, function(err, review){
        if(err){
            console.log(err);
           res.redirect("/reviews");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    review.comments.push(comment);
                    review.save();
                    res.redirect("/reviews/" + review._id);
                }
            })
        }
    })
});


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Authentication ROUTES
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++

// show sign up form
app.get("/register", function(req, res){
    res.render("register");
});

// register user
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/reviews");
        });
    });
});


// show login form
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/reviews",
    failureRedirect: "/login"
}), function(req, res){
    
});


// logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/reviews");
});


function isSignedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


// Server Listening
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});