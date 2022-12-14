const { request, response } = require("express");
const { Categoria } = require('../models')


// obtnerCategorias - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .skip( Number( desde ) )
        .limit(Number(limite))
        .populate('usuario', `nombre`)
    ])

    res.json({
        total,
        categorias
    })

}

// obtenerCategoria - populate {}
const obtenerCategoriaPorId = async (req = request, res = response) => {

    const { id } = req.params

    const categoria = await Categoria.findById(id)
        .populate('usuario', [`nombre`, `rol`])

    res.json({
        categoria
    })
}

const crearCategoria = async (req = request, res = response) => {

    try {
        const nombre = req.body.nombre.toUpperCase();

        // Generar la data a guardar
        const data = {
            nombre,
            usuario: req.usuario._id
        }

        const categoria = new Categoria(data);

        await categoria.save()

        res.status(201).json(categoria)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Error al crear la categoria'
        })
    }

}

// actualizarCategoria
const actualizarCategoria = async(req = request, res = response) => {

    const { id } = req.params
    
    const { _id, estado, usuario, ...resto } = req.body

    resto.nombre = resto.nombre.toUpperCase()

    resto.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate(id, resto, {new: true})

    res.json(categoria)

}

// borrarCategoria - estado: false
const borrarCategoria = async(req = request, res = response) => {

    const { id } = req.params

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false}, { new: true})

    res.json({
        categoria,
        msg: "La categoria se borro correctamente"
    })
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    borrarCategoria
}