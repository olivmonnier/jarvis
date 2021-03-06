var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    rsServices = require('./services'),
    RiveScript = require('rivescript');

var bot = new RiveScript();
rsServices(bot);
bot.loadDirectory("brain", success_handler, error_handler);

function success_handler(loadcount) {
  console.log("Load #" + loadcount + " completed!");

  bot.sortReplies();

	// Set up the Express app.
	var app = express();

	// Parse application/json inputs.
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
	app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
	app.set("json spaces", 4);

	// Set up routes.
	app.post("/reply", getReply);
	app.get("/", function(req, res) {
    return res.render('index', {
      title: 'Jarvis Home'
    });
  });
	app.get("*", showUsage);

	// Start listening.
	app.listen(3000, function() {
		console.log("Listening on http://localhost:3000");
	});
}

function error_handler (loadcount, err) {
	console.log("Error loading batch #" + loadcount + ": " + err + "\n");
}

// POST to /reply to get a RiveScript reply.
function getReply(req, res) {
	// Get data from the JSON post.
	var username = req.body.username;
	var message  = req.body.message;
	var vars     = req.body.vars;
  var filename = "./users/" + username.toLowerCase() + ".json";

	// Make sure username and message are included.
	if (typeof(username) === undefined || typeof(message) === undefined) {
		return error(res, "username and message are required keys");
	}

	// Copy any user vars from the post into RiveScript.
	if (typeof(vars) !== undefined) {
		for (var key in vars) {
			if (vars.hasOwnProperty(key)) {
				bot.setUservar(username, key, vars[key]);
			}
		}
	}

  // Get all the user's vars back out of the bot to include in the response.
  vars = bot.getUservars(username);

  if (!vars) {
    try {
      var stats = fs.statSync(filename);

      if (stats) {
        var jsonText = fs.readFileSync(filename);
        vars = JSON.parse(jsonText);
        bot.setUservars(username, vars);
      }
    } catch(e) {}
  }

  fs.writeFile(filename, JSON.stringify(vars, null, 2), function(err) {
    if (err) {
      console.log("Failed to write file", filename, err);
    }
  });

	// Get a reply from the bot.
  bot.replyAsync(username, message).then(function(reply) {
    reply = isJsonString(reply) ? JSON.parse(reply) : reply;
    var answer = (typeof reply === 'object') ? reply.msg : reply;
    var ext = (typeof reply === 'object') ? reply.ext : '';
    // Send the JSON response.
  	res.json({
  		"status": "ok",
  		"reply": answer,
      "ext": ext,
  		"vars": vars
  	}).end();
  }).catch(function(error) {
    console.log('Error: ' + error);
  });
}

// All other routes shows the usage to test the /reply route.
function showUsage(req, res) {
	var egPayload = {
		"username": "soandso",
		"message": "Hello bot",
		"vars": {
			"name": "Soandso"
		}
	};
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.write("Usage: curl -i \\\n");
	res.write("   -H \"Content-Type: application/json\" \\\n");
	res.write("   -X POST -d '" + JSON.stringify(egPayload) + "' \\\n");
	res.write("   http://localhost:3000/reply");
	res.end();
}

// Send a JSON error to the browser.
function error(res, message) {
	res.json({
		"status": "error",
		"message": message
	});
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
