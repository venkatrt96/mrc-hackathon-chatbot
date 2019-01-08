const express = require('express');
const map = require('lodash/map');
const isEqual = require('lodash/isEqual');
const auth = require('../auth');

const router = express.Router();

router.get('/me', auth.protected, (req, res) => {
  const { name, id, groups } = req.user;
  const matchedGroupList = [];
  map(groups, (group) => {
    if ((isEqual(group.displayName, 'CHATBOT-USER') || isEqual(group.displayName, 'CHATBOT-SERVICE')) && group) {
      matchedGroupList.push(group);
    }
  });
  let groupName = '';
  console.log(matchedGroupList);
  if (matchedGroupList && matchedGroupList[0] && matchedGroupList[0].displayName) {
    const matchedGroupName = matchedGroupList[0].displayName;
    groupName = matchedGroupName.split('-')[1];
    console.log(groupName);
  }
  res.json({
    name,
    email: id,
    groupName,
  });
});

module.exports = router;
