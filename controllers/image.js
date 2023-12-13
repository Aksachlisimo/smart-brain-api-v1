const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai. 
const app = new Clarifai.App({
 apiKey: '4029e28fb41a4300977eea4e6634b493' 
});

const handleApiCall = (req, res) => {
  console.log('Input received:', req.body.input);
  app.models.predict('face-detection', req.body.input)
    .then(data => {
      console.log('Clarifai API Response:', data);
      res.json(data);
    })
    .catch(err => {
      console.error('Clarifai API Error:', err);
      res.status(400).json('unable to work with API');
    });
}


const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
    // entries[0] --> this used to return the entries
    // TO
    // entries[0].entries --> this now returns the entries
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}