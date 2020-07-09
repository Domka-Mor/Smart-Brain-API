const handleRegister = (req, res, bcrypt, db) => {
	const{email,name,password} =req.body;

	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	} 
	// security= zabrani registrovat sa prazdnemu uzivatelovi

	const hash = bcrypt.hashSync(password);

		db.transaction(trx => {
			// transaction robi viac veci naraz
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				// tu je druha transaction
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})	
			})
			.then(trx.commit)
			// aby pridalo 
			.catch(trx.rollback)
			// v pripade chyby sa neuskutocia tieto operacie
		})
	.catch(err => res.status(400).json('unable to register'))
}



module.exports = {
	handleRegister: handleRegister
};