/**
 * @typedef {{
 *   userName: string;
 *   id: string;
 * }} User
 */

module.exports = {
  /**
   * @param {string} userName
   * @returns {User}
   */
  getUserByUserName(userName) {
    return { userName, id: userName };
  },

  /**
   * @param {string} userId
   * @param {string} password
   * @returns {boolean}
   */
  certifyByPassword(userId, password) {
    const certMap = {
      ginpei: "123456",
    };

    const correctPassword = certMap[userId];
    return correctPassword && correctPassword === password;
  },
};
