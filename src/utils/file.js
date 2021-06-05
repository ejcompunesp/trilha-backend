const fs = require('fs');
const path = require('path');

module.exports = {
  deleteFile: (filename) => {
    fs.unlink(path.resolve(__dirname, '..', '..', 'uploads', filename), (err) => {
      if (err)
        console.log(error);
    });
  }
}