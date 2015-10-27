var fs   = require('fs');
var path = require('path');

var Course = {
  all() {
    return fs.readdirSync(path.join(__dirname, '..', '..', 'courses'));
  },
  find(id) {
    if (this.all().indexOf(id) > -1) {
      return {
        name: id,
        challenges: require(path.join(__dirname, '..', '..', 'courses', id, 'index.js'))
      };
    } else {
      return { error: `invalid course ${id}` };
    }
  }
}

module.exports = Course;
