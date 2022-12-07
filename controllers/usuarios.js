const { response, request } = require('express')


const usuariosGet = (req = request, res = response) => {

    const query = req.query

    res.json({
        msg: 'get Api - controlador',
        query
    })
}

const usuariosPost = (req, res = response) => {

    const body = req.body;

    res.json({
        msg: 'post Api - controlador',
        body
    })
}
const usuariosPut = (req = request, res = response) => {

    const { id } = req.params

    res.json({
        msg: 'put Api - controlador',
        id
    })
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch Api - controlador'
    })
}
const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete Api - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}