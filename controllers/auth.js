const { request, response, json } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario')
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })

        if ( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        // Si el usuario está activo
        if ( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }


        // Verificar la conntraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password )
        if ( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id )

        res.json({
           usuario,
           token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async( req = request, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo })

        if ( !usuario ){
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            }

            usuario = new Usuario( data )
            await usuario.save()
        }

        // Si el usuario tiene el estado en false
        if ( !usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloquedo'
            })
        }

        //Generar el json web token
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
         })
    

    } catch (error) {
        console.log( error )
        json.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

   
}

module.exports = {
    login,
    googleSignIn
}