//ecoute des requetes http et re^ponse
const http = require('http');// import paquage http
const app = require('./app');// import app

// la fonction normalizePort renvoie un port valide
const normalizePort = val => {
  const port = parseInt(val, 10); //entre 8 et 12

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // PORT pour app express

//errorHandler recherche les différentes erreurs pour les gérer
//enregistre ensuite dans le server
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// creation du server, on mets l'app comme parametre
const server = http.createServer(app);

//écoute évènement
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//le server ecoute le requete envoyé
server.listen(port);
