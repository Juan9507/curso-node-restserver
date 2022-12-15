const { default: mongoose } = require("mongoose");
const { existeCategoriaPorId } = require("../helpers/db-validators");
const { Producto, Categoria } = require("../models");


/**
 * obtnerCategorias - paginado - total - populate
 */

const obtenerProductos = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .skip( Number( desde ) )
        .limit(Number(limite))
        .populate('usuario', `nombre`)
        .populate('categoria', `nombre`)
    ])

    res.json({
        total,
        productos
    })

}

// obtenerCategoria - populate {}
const obtenerProductoPorId = async (req = request, res = response) => {

    const { id } = req.params

    const producto = await Producto.findById(id)
        .populate('usuario', `nombre`)
        .populate('categoria', `nombre`)

    res.json({
        producto
    })
}

/**
 * Crear producto
 */
const crearProducto = async (req = request, res = response) => {

    try {
        const { estado, usuario, ...body } = req.body;

        // Generar la data a guardar
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id,
        }

        const producto = new Producto(data);

        await producto.save()

        res.status(201).json(producto)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Error al crear el producto'
        })
    }

}

// actualizarCategoria
const actualizarProducto = async(req = request, res = response) => {

    const { id } = req.params
    
    const { _id, estado, usuario, ...resto } = req.body

    resto.usuario = req.usuario._id

    const producto = await Producto.findByIdAndUpdate(id, resto, {new: true})
        .populate('usuario', `nombre`)
        .populate('categoria', `nombre`)

    res.json(producto)

}

// borrarCategoria - estado: false
const borrarProducto = async(req = request, res = response) => {

    const { id } = req.params

    const producto = await Producto.findByIdAndUpdate(id, { estado: false}, { new: true})

    res.json({
        producto,
        msg: "La categoria se borro correctamente"
    })
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    borrarProducto
}