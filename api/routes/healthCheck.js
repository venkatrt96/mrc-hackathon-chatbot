const express = require('express');
const { client } = require('../helpers/redis');

const router = express.Router();

router.get('/redis', (req, res) => {
  client.ping().then((msg) => {
    res.status(200).json({ msg });
  }).catch((err) => {
    console.error('Redis Error: ', err);
    res.status(500).json({ err });
  });
});

module.exports = router;
