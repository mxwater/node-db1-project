const db = require('../../data/db-config');

const getAll = () => {
  return db('accounts');
}

const getById = id => {
  return db('accounts')
    .where('id', id)
    .first();
}

const create = account => {
  return db('accounts')
    .insert(account)
    .then(([id]) => getById(id));
}

const updateById = (id, account) => {
  return db('accounts')
    .where('id', id)
    .update(account)  // Fixed: using "account" instead of "changes"
    .then(count => (count > 0 ? getById(id) : null));
}

const deleteById = id => {
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
