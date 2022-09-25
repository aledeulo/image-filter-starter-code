import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  const path = process.env.OUT_PUT_PATH || '/temp'
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // This URL can be used for testing purposes: image_url=https://image.shutterstock.com/image-photo/diverse-amazon-forest-seen-above-600w-2072628056.jpg
app.get('/filteredimage',async (req: Request, res: Response) => {
  console.log('Received request to filter image. Validating query params');
  const query = require('url').parse(req.url,true).query;
  const image_url:string = query.image_url;
  if (!image_url) {
    res.status(400).send('The request must contains image_url as parameter!!!');
  }

  try {
    console.log('Attempting to filter image from URL: %s', image_url);
    const outPath:string = await filterImageFromURL(image_url, path);
    console.log('Received filtered image path: %s', outPath);
    res.status(200).sendFile(outPath);
    console.log('Attempting to delete the files already filtered and sent.')
    res.on('finish', () => deleteLocalFiles([outPath]));
    console.log('Deleted the files already filtered and sent.')
  } catch (error) {
    res.status(500).send({error: 'Unable to process the request'});
  }
});

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();