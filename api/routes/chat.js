const express = require('express');
const find = require('lodash/find');
const remove = require('lodash/remove');
const isEqual = require('lodash/isEqual');
const { client } = require('../helpers/redis');
const { getChatUsers, getChatMessagesById } = require('../helpers/chatHelper');

const router = express.Router();

router.post('/join', (req, res) => {
  const { id, username } = req.body;
  const payload = { id, username };
  getChatUsers(client).then((chatUsers) => {
    const users = !chatUsers ? [] : chatUsers;
    const userFound = users && find(users, (user) => {
      return isEqual(user.id, id);
    });
    if (!userFound) {
      users.push(payload);
    }
    client.set('chatUsers', JSON.stringify(users));
    res.json({
      users,
      status: 'OK',
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).json({
      status: 'ERROR',
    });
  });
});

router.post('/leave', (req, res) => {
  const { id } = req.body;
  getChatUsers(client).then((chatUsers) => {
    const users = !chatUsers ? [] : chatUsers;
    if (users) {
      remove(users, (user) => {
        return isEqual(user.id, id);
      });
    }
    client.set('chatUsers', JSON.stringify(users));
    res.json({
      status: 'OK',
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).json({
      status: 'ERROR',
    });
  });
});

router.get('/users', (req, res) => {
  getChatUsers(client).then((chatUsers) => {
    const users = chatUsers || [];
    res.json({
      users,
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).json({
      status: 'ERROR',
    });
  });
});

router.post('/message', (req, res) => {
  const { sender, message } = req.body;
  if (sender && sender.id) {
    getChatMessagesById(client, sender.id).then((messages) => {
      const chatMessages = (isEqual(typeof messages, 'object') && messages) || [];
      chatMessages.push({
        sender,
        message,
      });
      client.set(`rooms:${sender.id}`, JSON.stringify(chatMessages));
      res.json({
        messages: chatMessages,
        status: 'OK',
      });
    }).catch((err) => {
      console.error(err);
      res.status(500).json({
        status: 'ERROR',
      });
    });
  } else {
    res.status(500).json({
      status: 'ERROR',
    });
  }
});

router.post('/message/fetch', (req, res) => {
  const { id } = req.body;
  getChatMessagesById(client, id).then((messages) => {
    const chatMessages = (isEqual(typeof messages, 'object') && messages) || [];
    console.log('message', id, chatMessages);
    res.json({
      messages: chatMessages,
      status: 'OK',
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).json({
      status: 'ERROR',
    });
  });
});

module.exports = router;
