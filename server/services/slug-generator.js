var slug = require('slug');
var shortid = require('shortid');

function createSlug(title) {
  var slugTitle = slug(title) + "-" + shortid.generate();
  return slugTitle.toLowerCase();
};

module.exports = {createSlug: createSlug};
