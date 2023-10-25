const express = require('express')
const { format } = require('express/lib/response')
const app = express()
const server = require('http').Server(app);  
let puerto = 3000

app.use(express.static('public'));
app.set('port', process.env.PORT || puerto);
app.get('/', (req, res) => {
  res.send('Prueba de fe!')
});

server.listen(app.get('port'), function() {  
  console.log("Servidor corriendo en el puerto: "+app.get('port'));
});
