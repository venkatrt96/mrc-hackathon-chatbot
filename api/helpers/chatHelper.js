async function getChatUsers(client) {
  const response = await client.get('chatUsers');
  return JSON.parse(response);
}

async function getChatMessagesById(client, id) {
  const response = await client.get(`rooms:${id}`);
  return JSON.parse(response);
}

async function getChatRooms(client) {
  const response = await client.get('rooms');
  return JSON.parse(response);
}

module.exports = { getChatUsers, getChatMessagesById, getChatRooms };
