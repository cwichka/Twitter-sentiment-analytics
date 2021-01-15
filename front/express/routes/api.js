var express = require('express');
var passport = require('passport');
var csrf=require('csurf');
var csrfProtection = csrf();
//var join= require('../models/join');
//var offre= require('../models/offre');
var user= require('../models/user');
//var ObjectId = require('mongoose').Types.ObjectId;
//var nodemailer = require('nodemailer');
var router = express.Router();
var history = require('../models/history');
//router.use(csrfProtection);
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("i have been calleed");
//  res.send({'csrfToken':req.csrfToken()});
    res.send({"data":"data"})
});

router.post('/gethistory', function(req,res,next){
  history.find({},function(error,history){
    if (error) res.send({"data":"error"})
    else if (!history) {
      res.send({"data":"nohistory"})

    }else {
      res.send({"data":history})
    }
  })
})

router.post('/addhistory', function(req,res,next){
  if (req.isAuthenticated()){

    var e = new history();
    e.keyword = req.body.keyword;
    e.ID_user = req.user._id;
    e.save(function(err){
      if(err){
        console.log("notsaved")

      }else{
        console.log("saved")
      }
    })
  }

})

router.post('/login', function(req, res, next) {
  console.log(req.body);
  passport.authenticate('local-login', function(err, user, info) {
    console.log('123123')
    if (err) {
        console.log('error')
        return res.send({data:"error"});
    }
    if (!user) {
        console.log("notfound");
        return res.send({data:"req"});
               }
    req.logIn(user, function(err) {
      if (err) {
          console.log('other error')
          return res.send({data:'wrong password'});
      }
      return res.send({data:user});
    });
  })(req, res, next);
});


router.post('/register', function(req, res, next) {
  console.log(req.body);
  passport.authenticate('local-signup', function(err, user, info) {
    console.log('0000');
    console.log(user);
    if (err) {
        console.log('error')
        return res.send({data:"error"});
    }else{
      return res.send({data:"added"})
    }

  })(req, res, next);
});
/*router.post('/register', function(req, res) {
  User.register(new User({ login: req.body.login }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local-signup')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});*/



/*router.post('/send-mail',function(req,res){
  console.log('whaaat');
  var from = 'kharratali@gmail.com';
  var subject = req.body.mailSubject;
  var body = req.body.mailBody;

  var mailOptions = {
    from: from,
    to: "kharratali@hotmail.com",
    subject: subject,
    //text: body,
    html:body
  };
  sendMail(mailOptions);
  res.end("done");
});*/

/*function sendMail(mailOptions,res){
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'kharratali@gmail.com', // Your email id
      pass: 'fatma@90' // Your password
    }
  });
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      return({yo: 'error'});
    }else{
      console.log('Message sent: ' + info.response);
      return({yo: info.response});
    };
  })
};*/

module.exports = router;
