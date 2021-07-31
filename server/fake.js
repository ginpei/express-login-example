/**
 * @typedef {{
 *   userName: string;
 *   id: string;
 * }} User
 */

/**
 * @typedef {{
 *   userId: string;
 *   password: string;
 * }} UserCredential
 */

/**
 * @typedef {{
 *   id: string;
 *   userId: string | undefined;
 * }} Session
 */

/** @type {Map<string, User>} */
const fakeUserDatabase = new Map([
  ["user-001", { id: "user-001", userName: "alice" }],
  ["user-002", { id: "user-002", userName: "bob" }],
  ["user-003", { id: "user-003", userName: "charlie" }],
]);

/** @type {Map<string, UserCredential>} */
const fakeUserCredentialDatabase = new Map([
  ["user-001", { userId: "user-001", password: "123456" }],
  ["user-002", { userId: "user-002", password: "123456789" }],
  ["user-003", { userId: "user-003", password: "qwerty" }],
]);

/** @type {Map<string, Session>} */
const fakeSessions = new Map();

module.exports = {
  /**
   * @param {string} id
   * @returns {User | null}
   */
  getUser(id) {
    return fakeUserDatabase.get(id) ?? null;
  },

  /**
   * @param {string} userName
   * @returns {User | null}
   */
  getUserByUserName(userName) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [, user] of fakeUserDatabase) {
      if (user.userName === userName) {
        return user;
      }
    }

    return null;
  },

  /**
   * @param {string} userId
   * @param {string} password
   * @returns {boolean}
   */
  certifyByPassword(userId, password) {
    const cred = fakeUserCredentialDatabase.get(userId);
    if (!cred) {
      return false;
    }

    return cred.password === password;
  },

  /**
   * @returns {{ userName: string; password: string }}
   */
  getRandomUserCredential() {
    const creds = Array.from(fakeUserCredentialDatabase.values());
    const cred = creds[Math.floor(Math.random() * creds.length)];
    const user = module.exports.getUser(cred.userId);
    const loginCred = { userName: user.userName, password: cred.password };
    return loginCred;
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
    fakeSessions.set(session.id, session);
  },

  /**
   * @param {string} sessionId
   * @returns {void}
   */
  deleteSession(sessionId) {
    fakeSessions.delete(sessionId);
  },

  /**
   * @param {string} id
   * @returns {Session | null}
   */
  getSession(id) {
    const session = fakeSessions.get(id) ?? null;
    return session;
  },
};

function generateId() {
  return Math.random().toFixed(32).slice(2);
}
