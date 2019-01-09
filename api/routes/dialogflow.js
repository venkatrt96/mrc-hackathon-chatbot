const express = require('express');
const fetch = require('../helpers/fetch');

const router = express.Router();

router.post('/', (req, res) => {
  fetch(res)
    .post('http://localhost:3000/dialogFlow/conversation',
      req.body).then((response) => {
      console.log(response);
      res.json(response);
    }).catch((err) => {
      console.error(err);
      res.status(500).json({});
    });
});

module.exports = router;
