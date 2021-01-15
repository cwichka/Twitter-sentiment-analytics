var admin = require('./models/user');

var mongoose = require('mongoose');
 mongoose.connect ('localhost:27017/database');

var Admin =
new admin()

  Admin.login = 'Administrator';
  Admin.password = Admin.generateHash("0000");
  Admin.type = "admin";
	Admin.save(function(err, result) {

			exit();

	});


function exit() {
	mongoose.disconnect();
}
