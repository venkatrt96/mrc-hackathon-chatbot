const io = require('socket.io-client');

const socket = io('http://localhost:3100');

module.exports = { socket };
