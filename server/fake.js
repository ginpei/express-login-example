/**
 * @typedef {{
 *   userName: string;
 *   id: string;
 * }} User
 */

/**
 * @typedef {{
 *   id: string;
 *   userId: string | undefined;
 * }} Session
 */

/** @type {Map<string, Session>} */
const lSessions = new Map();

module.exports = {
  /**
   * @param {string} id
   * @returns {User}
   */
  getUser(id) {
    return { userName: id, id };
  },

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

  /**
   * @param {string | undefined} userId
   * @returns {Session}
   */
  createSession(userId) {
    return {
      id: generateId(),
      userId,
    };
  },

  /**
   * @param {Session} session
   * @returns {void}
   */
  saveSession(session) {
    lSessions.set(session.id, session);
  },

  /**
   * @param {string} id
   * @returns {Session | null}
   */
  getSession(id) {
    const session = lSessions.get(id) ?? null;
    return session;
  },
};

function generateId() {
  return Math.random().toFixed(32).slice(2);
}
