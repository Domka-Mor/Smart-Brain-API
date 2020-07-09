const Clarifai = require ('clarifai');



const app = new Clarifai.App({
 apiKey: '380408be432245aab0505e7dd15cf235'
});

const handleApiCall = (req, res) => {
	app.models
	.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		res.json(data)
	})	
	.catch(err => res.status(400).json('Unable to work with API'))
}
// SECURITY: na skrytie API KEY,nesmie byt ba forende



const handleImage = (req, res, db) => {
	const {id} = req.body;
	db('users').where('id', '=', id)
 	.increment('entries',1)
 	.returning('entries')
 	.then(entries => {
 		res.json(entries[0])
 	})
 	.catch(err => res.status(400).json('Unable to get entries'))
}


// ID preto, lebo entries ma kazdy uzivatel ine, a ID je ich jediny identifikator
// Body preto, lebo sa ti to pripocita k entries, co je v ramci objektu v body.





module.exports = {
	handleImage,
	handleApiCall
	// mozes aj takto zapisat
};