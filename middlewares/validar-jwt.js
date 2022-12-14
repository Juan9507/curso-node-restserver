const { request, response } = require('express')
const jwt = require('jsonwebtoken')
const { restart } = require('nodemon')
const Usuario = require('../models/usuario')

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        const usuario = await Usuario.findById(uid)

        if ( !usuario ){
            return restart.status(401).json({
                msg: 'Usuario no existe en DB'
            })
        }


        // Verificar si el uid tiene estado true
        if ( !usuario.estado ){
            return restart.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }

        // Se puede usa por referencia la request del usuario que tiene el token
        req.usuario = usuario

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}