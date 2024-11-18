const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  // Log the incoming request to verify data
  console.log('Request body:', req.body);

  // Validate input fields
  if (!email || !name || !password) {
    console.log('Missing fields:', { email, name, password });
    return res.status(400).json('Incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        });
    })
    .then(trx.commit)
    .catch(err => {
      console.error('Transaction Error:', err);
      trx.rollback();
      res.status(400).json('Unable to register');
    });
  })
  .catch(err => {
    console.error('Transaction Setup Error:', err);
    res.status(400).json('Unable to register');
  });
}

module.exports = {
  handleRegister: handleRegister
};
