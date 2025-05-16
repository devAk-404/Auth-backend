const fs = require('fs').promises;
const path = require('path');

const USERS_FILE_PATH = path.join(__dirname, '../users.json');

// In-memory store for refresh tokens (replace with a database)
const refreshTokens = {};

// Function to read users from the JSON file
const readUsers = async () => {
    try {
        const data = await fs.readFile(USERS_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist or is invalid JSON, return an empty array
        return [];
    }
};

// Function to write users to the JSON file
const writeUsers = async (users) => {
    try {
        await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing to users.json:', error);
    }
};

// Initialize users from the file on module load
let users = [];
(async () => {
    users = await readUsers();
})();

const findUserByUsername = (username) => {
    return users.find(user => user.username === username);
};

const findUserById = (id) => {
    return users.find(user => user.id === id);
};

const addUser = async (newUser) => {
    users.push(newUser);
    await writeUsers(users);
};

const findRefreshToken = (token) => {
    return refreshTokens[token];
};

const addRefreshToken = (token, userId) => {
    refreshTokens[token] = { userId };
};

const deleteRefreshToken = (token) => {
    delete refreshTokens[token];
};

module.exports = {
    users, // Export for potential direct access (be mindful of in-memory vs file)
    refreshTokens,
    findUserByUsername,
    findUserById,
    addUser,
    findRefreshToken,
    addRefreshToken,
    deleteRefreshToken,
};