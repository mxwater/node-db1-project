const router = require('express').Router();
const Accounts = require('./accounts-model');  // Import the model
const {
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique
} = require('./accounts-middleware');

// [GET] /api/accounts - Returns an array of accounts
router.get('/', async (req, res, next) => {
  try {
    const accounts = await Accounts.getAll();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

// [GET] /api/accounts/:id - Returns an account by the given id
router.get('/:id', checkAccountId, (req, res) => {
  res.json(req.account);  // The account is attached to req by the middleware checkAccountId
});

// [POST] /api/accounts - Creates a new account
router.post('/', checkAccountPayload, checkAccountNameUnique, async (req, res, next) => {
  try {
    const newAccount = {
      name: req.body.name.trim(),  // Trim leading/trailing whitespace
      budget: req.body.budget,
    };
    const account = await Accounts.create(newAccount);
    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
});

// [PUT] /api/accounts/:id - Updates an account by id
router.put('/:id', checkAccountId, checkAccountPayload, async (req, res, next) => {
  try {
    const changes = {
      name: req.body.name.trim(),  // Trim leading/trailing whitespace
      budget: req.body.budget,
    };
    const updatedAccount = await Accounts.updateById(req.params.id, changes);
    res.json(updatedAccount);
  } catch (err) {
    next(err);
  }
});

// [DELETE] /api/accounts/:id - Deletes an account by id
router.delete('/:id', checkAccountId, async (req, res, next) => {
  try {
    const deletedAccount = await Accounts.deleteById(req.params.id);
    res.json(deletedAccount);
  } catch (err) {
    next(err);
  }
});

// Error-handling middleware
router.use((err, req, res, next) => {  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = router;
