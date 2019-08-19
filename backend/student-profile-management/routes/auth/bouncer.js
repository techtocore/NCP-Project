var bouncer = require ("express-bouncer")(500, 900000);

// Add white-listed addresses (optional)
bouncer.whitelist.push ("127.0.0.1");

// In case we want to supply our own error (optional)
bouncer.blocked = function (req, res, next, remaining)
{
	res.status(429).send({
      message : "Too many requests have been made, " + "please wait " + remaining / 1000 + " seconds"});
};

module.exports = bouncer;