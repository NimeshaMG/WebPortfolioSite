process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('./config/express');
var app = express();    
app.listen(3000);
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");    
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./app/models/User");
module.exports = app;



mongoose.connect('mongodb+srv://Nimesha:852992@cluster0.jqaz8jd.mongodb.net/WebPortfolioSite', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
  secret: "Rusty is a dog",
  resave: false,
  saveUninitialized: false
}));

const passport = require("passport");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/secret', isLoggedIn, function (req, res) {
  res.render('secret');
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async (req, res) => {
    try {
      const user = await User.create({
        username: req.body.username,
        password: req.body.password
      });
  
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  });
  

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", async function (req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = req.body.password === user.password;
      if (result) {
        res.redirect("contact");
      } else {
        res.send('<script>alert("Password doesn\'t match"); window.history.back();</script>');
      }
    } else {
      res.send('<script>alert("User doesn\'t exist"); window.history.back();</script>');
    }
  } catch (error) {
    res.send(`<script>alert("${error.message}"); window.history.back();</script>`);
  }
});

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/about');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
const Contact = mongoose.model('Contact', {
    name: String,
    phoneNumber: String,
    email: String
  });
  
  app.get('/contact', async (req, res) => {
    try {
      const contacts = await Contact.find({});
      res.render('contact', { contacts: contacts });
    } catch (err) {
      console.error('Error retrieving contacts:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.get("/update/:id", function (req, res) {
    const contactId = req.params.id;
    res.render("update", { contactId });
  });
  
  app.post('/update/:id', (req, res) => {
    const contactId = req.params.id;
  
    const updatedContact = {
      name: req.body.name,
      phoneNumber: req.body.number,
      email: req.body.email
    };
  
    Contact.findOneAndUpdate(
      { _id: contactId },
      { $set: updatedContact },
      { new: true }
    )
      .then(updatedContact => {
        res.redirect('/contact');
      })
      .catch(error => {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Failed to update the contact' });
      });
  });
  
  app.get('/js/update.js', (req, res) => {
    res.sendFile(__dirname + '/update.js');
  });
  
  app.delete('/delete/:id', (req, res) => {
    const contactId = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).send('Invalid contact ID');
    }
  
    Contact.findOneAndRemove({ _id: contactId })
      .then((deletedContact) => {
        if (!deletedContact) {
          return res.status(404).send('Contact not found');
        }
        res.sendStatus(204); // No content (successful deletion)
      })
      .catch((err) => {
        console.error('Error deleting contact:', err);
        res.status(500).send('Error deleting contact');
      });
  });
  
console.log('Server running at http://localhost:3000/');
