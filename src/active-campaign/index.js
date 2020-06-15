require("dotenv").config();
var ActiveCampaign = require("activecampaign");

var ac = new ActiveCampaign(
	process.env.activecampaign_url, 
	process.env.activecampaign_token
);

	// TEST API credentials
	ac.credentials_test().then(function(result) {
		// successful request
		if (result.success) {
			// VALID ACCOUNT
			console.log("VALID ACCOUNT")
		} else {
			// INVALID ACCOUNT
			console.log("INVALID ACCOUNT")
		}
	}, function(result) {
		// request error
		console.log(result)
	});

// GET requests
// var contact_list = ac.api("contact/list?ids=all&sort=id&sort_direction=ASC&page=1", {}, function(response) {
//         console.log(response);
// }).then((result) => console.log(result))
// 	;


// POST request

const contact = {
	email: "data@prueba.com",
	first_name: "Pedro",
	last_name: "Perez",
	phone: "946599356",
	'p[1]': '1' 
}

var contact_add = ac.api("contact/add", contact);

contact_add.then(function(result) {
	console.log(result);
}, function(result) {
	console.log(result);
});


	// var list = {
	// 	name: "List 3",
	// 	sender_name: "My Company",
	// 	sender_addr1: "123 S. Street",
	// 	sender_city: "Chicago",
	// 	sender_zip: "60601",
	// 	sender_country: "USA"
	// };

	// var list_add = ac.api("list/add", list);
	// list_add.then(function(result) {
	// 	// successful request
	// 	console.log(result);
	// }, function(result) {
	// 	// request error
	// })