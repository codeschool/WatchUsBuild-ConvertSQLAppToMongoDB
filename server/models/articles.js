var mongo = require('mongodb');
var objectId = mongo.ObjectId;
var slugGenerator = require(path.join(__dirname, '..', 'services', 'slug-generator'));

var Articles = {
  recent(cb) {
    // ============
    // Params
    // ============
    //  none
    //=============
    // SQL
    //============
    // SELECT
    //    a.news, a.url, a.title, a.slug, a.body, a.published_at, u.name, u.avatar_url,
    //    (SELECT COUNT(*) FROM comments WHERE article_id = a.id) AS comment_count
    // FROM
    //    articles AS a LEFT JOIN users AS u ON a.user_id = u.id
    // ORDER BY published_at
    var collection = mongo.DB.collection('articles');

    collection.find({}).sort({published_at: -1}).toArray(function(err, docs){
      cb(err, docs);
    });

  },

  findBySlug(slug, cb){
    // ============
    // Params
    // ============
    // - slug
    //
    //=============
    // SQL
    //============
    //
    //  SELECT
    //    a.title, a.id, a.slug, a.body, a.url, u.avatar_url, u.name
    //  FROM
    //    articles a
    //  JOIN users u on a.user_id = u.id
    //  WHERE a.slug = $1', [slug]
    var collection = mongo.DB.collection('articles');

    var query = { slug: slug }
    collection.find(query).limit(1).next(function(err, doc){
      cb(err, doc)
    });
  },

  create(args, cb) {
    // ============
    // Params
    // ============
    // args
    // - title
    // - body
    // - url
    // - slugGenerator.createSlug(title)
    // - published_at
    // - user
    //   - user internal id
    //   - user displayname || username
    //   - user['_json'].avatar_url
    // - comment_count
    // - comments
    //
    //=============
    // SQL
    //=============
    //
    // INSERT INTO articles
    //   (title, slug, body, url, user_id, news) VALUES ($1, $2, $3, $4, $5, false) RETURNING slug;,
    //   [title, slugTitle, body, url, userId]
    var collection = mongo.DB.collection('articles');
    var doc = {
      title: args.title,
      body: args.body,
      url: args.url,
      slug: slugGenerator.createSlug(args.title),
      published_at: new Date(),
      user: {
        id: new objectId(args.user._id),
        name: args.user.displayName || args.user.username,
        avatar_url: args.user['_json'].avatar_url
      },
      comment_count: 0,
      comments: []
    }

    collection.insertOne(doc, function(err){
      cb(err);
    });
  },

  addComment(args, cb){
    // ============
    // Params
    // ============
    // args
    // - slug
    // - comment(body)
    // - user (internal id, name, avatar)
    //
    // -> comment: id, body, published_at, user -> { id, name, avatar_url }
    // -> increase comment count
    //=============
    // SQL
    //=============
    // INSERT INTO comments
    //   (user_id, approved, body, article_id) VALUES ($1, $2, $3, (SELECT id FROM articles WHERE slug = $4)) RETURNING id;,
    //   [newComment.userId, approved, newComment.body, newComment.slug]
    var collection = mongo.DB.collection('articles');
    var query = {slug: args.slug};
    var update = {
      $push: {
        comments: {
          id: new objectId(),
          body: args.comment.body,
          published_at: new Date(),
          user: {
              id: new objectId(args.user._id),
              name: args.user.displayName || args.user.username,
              avatar_url: args.user['_json'].avatar_url
            }
        }
      },$inc:{comment_count: 1}
    };

    var options = {projection: {comments:{ $slice: -1}}, returnOriginal: false}

    collection.findOneAndUpdate(query, update, options, function(err, res){
      cb(err, res.value);
    });
  },

  editComment(args, cb) {
    // ============
    // Params
    // ============
    // args
    // - commentId
    // - user (internal id, name, avatar)
    // - updatedComment
    //
    //=============
    // SQL
    //============
    //  UPDATE comments SET body = $1 where id = $2 and user_id = $3 RETURNING id;",
    //  [body, id, user_id]

    var collection = mongo.DB.collection('articles');
    var commentId = new objectId(args.commentId);
    var currentUser = args.user._id;
    var query = {comments : {$elemMatch: {id: commentId, 'user.id': new objectId(currentUser)}}}
    var options = { projection : {'comments.$': 1}};
    var update = {
      $set: {'comments.$.body': args.updatedComment}
    }

    collection.findOneAndUpdate(query, update, options, function(err,doc){
      if(err) { cb(err) }

      cb(err, doc);
    });
  },

  deleteComment(args, cb) {
    // ============
    // Params
    // ============
    // args
    // - slug
    // - commentId
    // - user (internal id, name, avatar)
    //
    //
    // -> Decrease comment count
    //=============
    // SQL
    //============
    // DELETE FROM comments where id = $1 and user_id = $2;, [id, user_id]
    var collection = mongo.DB.collection('articles');
    var commentId = new objectId(args.commentId);
    var currentUser = args.user._id;
    var query = {comments : {$elemMatch: {id: commentId, 'user.id': new objectId(currentUser)}}}
    var update = {
      $pull: {comments:{id: commentId}},
      $inc: {comment_count: -1}
    }

    collection.findOneAndUpdate(query, update, function(err){
      cb(err);
    });
  }
}

module.exports = Articles;
