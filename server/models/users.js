var mongo = require('mongodb');

var Users= {
  findOrCreate(args, cb) {
    // ============
    // Params
    // ============
    // githubInfo
    // - id
    // - displayName || username
    // - ['_json'].avatar_url
    //
    // new user -> github_id, name, avatar_url
    //=============
    // SQL
    //============
    // See if users exists, return id if so
    // SELECT * FROM users WHERE github_id = $1', [id]
    //
    // Create the user if no id returned
    // INSERT INTO users (github_id, name, avatar_url)
    // VALUES ($1, $2, $3) RETURNING id;
    var collection = mongo.DB.collection('users');
    var query = {github_id: args.id};

    var newUser = {
      $setOnInsert: {
        github_id: args.id,
        name: args.displayName || args.username,
        avatar_url: args['_json'].avatar_url
      }
    }

    var options = {
      upsert: true,
      returnOriginal: false
    }

    collection.findOneAndUpdate(query, newUser, options, function(err, res){
      cb(err, res.value._id)
    });
  }
}

module.exports = Users;
