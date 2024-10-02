const db = require('../../data/db-config');

function getAll() {
  return db('accounts');
}

function getById(id) {
  return db('accounts')
  .where({ id }).first()
}

function create(account) {
  return db('accounts')
    .insert(account)
    .then(([id]) => getById(id));
}

function updateById(id, account) {
  return db('accounts')
    .where('id', id)
    .update(account)  // Fixed: using "account" instead of "changes"
    .then(count => (count > 0 ? getById(id) : null));
}

function deleteById(id) {
  return getById(id)
    .then(account => {
      if (!account) return null;
      return db('accounts')
        .where('id', id)
        .del()
        .then(() => account);
    });
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
