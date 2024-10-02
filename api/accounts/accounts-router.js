const express = require('express');
const router = express.Router();
const Accounts = require('./accounts-model')

const {
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique
} = require('./accounts-middleware');


router.get('/', async (req, res, next) => {
  try {
    const accounts = await Accounts.getAll();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});


router.get('/:id', checkAccountId, (req, res) => {
  res.json(req.account);  
});


router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const newAccount = {
      name: req.body.name.trim(),  
      budget: req.body.budget,
    };
    const account = await Accounts.create(newAccount);
    res.status(201).json(account);  
  } catch (err) {
    next(err);
  }
});


router.put('/:id', checkAccountId, checkAccountPayload, async (req, res, next) => {
  try {
    const changes = {
      name: req.body.name.trim(), 
      budget: req.body.budget,
    };
    const updatedAccount = await Accounts.updateById(req.params.id, changes);
    res.json(updatedAccount);
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', checkAccountId, async (req, res, next) => {
  try {
    const deletedAccount = await Accounts.deleteById(req.params.id);
    res.json(deletedAccount);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
