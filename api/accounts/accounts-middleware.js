const Accounts = require('./accounts-model');  
  
exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;

  if (name === undefined || budget === undefined) {
    return res.status(400).json({ message: "name and budget are required" });
  }

  if (name.trim().length < 3 || name.trim().length > 100) {
    return res.status(400).json({ message: "name of account must be between 3 and 100" });
  }

  if (typeof budget !== 'number' || isNaN(budget)) {
    return res.status(400).json({ message: "budget of account must be a number" });
  }

  if (budget < 0 || budget > 1000000) {
    return res.status(400).json({ message: "budget of account is too large or too small" });
  }

  next(); 
};

  exports.checkAccountId = (req, res, next) => {
    const { id } = req.params;
  
    Accounts.getById(id)
      .then(account => {
        if (!account) {
          return res.status(404).json({ message: "account not found" });
        }        
        req.account = account;
        next();
      })
      .catch(err => {
        res.status(500).json({ message: "Error checking account ID", error: err.message });
      });
  };

  exports.checkAccountNameUnique = (req, res, next) => {
    const { name } = req.body;
  
    Accounts.getAll()
      .then(accounts => {
        const existingAccount = accounts.find(
          account => account.name.trim().toLowerCase() === name.trim().toLowerCase()
        );
  
        if (existingAccount) {
          return res.status(400).json({ message: "that name is taken" });
        }
  
        next();
      })
      .catch(err => {
        res.status(500).json({ message: "Error checking account name", error: err.message });
      });
  };
  
