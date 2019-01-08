const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const messages = [{
    from: 'BOT',
    message: {
      type: 'text',
      content: 'Hi !!',
    },
  }, {
    from: 'Venkat',
    message: {
      type: 'text',
      content: 'Hello !!',
    },
  }];

  res.json({ messages });
});

module.exports = router;
