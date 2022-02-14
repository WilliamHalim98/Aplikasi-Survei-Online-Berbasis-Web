const bcrypt = require('bcrypt');

class Hash {
  static async hashEmailTitle(text) {
    try {
      const saltRounds = 10;
      const hashResults = await bcrypt.hash(text, saltRounds);
      return hashResults;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = Hash;
