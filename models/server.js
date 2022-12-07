const express = require('express')
const cors = require('cors')

// const path = require('path');


class Server {

    /**
     *  Middlewares -> funciones que añaden funcionalidad al webserver, 
     *   Middlewares -> funcion que siempre va a ejecutarse cuando levantemos nuestra aplicacion
     */
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes()
    }

    middlewares() {

        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use( express.json() )

        // Directorio publico -> se reconoce los middlewares por la palabra reservada use()
        this.app.use( express.static('public'))

    }

    routes(){

       this.app.use(this.usuariosPath, require('../routes/usuarios'))

        // this.app.get('/prueba', (req, res) => {
        //     res.sendFile( path.join(__dirname, '../public', 'prueba.html'))
        // })
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port)
        } )
    }

}

module.exports = Server;