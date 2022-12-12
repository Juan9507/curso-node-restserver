const { response, request } = require('express')
const bycrytjs = require('bcryptjs')

const Usuario = require('../models/usuario')


const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    // const usuarios = await Usuario.find(query)
    //     .skip( Number( desde ) )
    //     .limit(Number(limite))

    // const total = await Usuario.countDocuments(query);

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip( Number( desde ) )
        .limit(Number(limite))
    ])
    
    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} )

    // Encriptar la contreseña
    const salt = bycrytjs.genSaltSync()
    usuario.password = bycrytjs.hashSync( password, salt )

    // Guardar en DB
    await usuario.save()

    res.json(usuario)
}

const usuariosPut = async(req = request, res = response) => {

    const { id } = req.params
    const { _id, password, google, ...resto } = req.body

    // TODO validar contra base de datos
    if ( password ){
        // Encriptar la contrasseña
        const salt = bycrytjs.genSaltSync()
        resto.password = bycrytjs.hashSync( password, salt )
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true})

    res.json(usuario)
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch Api - controlador'
    })
}
const usuariosDelete = async(req = request, res = response) => {

    const { id } = req.params

    // Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id )

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false}, {new: true} )

    res.json({
        usuario,
        msg: "El usuario se borro correctamente"
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}