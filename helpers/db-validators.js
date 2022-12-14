const Role = require('../models/role')
const { Usuario, Categoria } = require('../models')

// const Categoria = require('../models/categoria')

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`)
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`${correo} Este correo ya está registrado`)
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`)
    }
}


const existeCategoriaPorId = async (id) => {

    const categoria = await Categoria.findById(id)

    if (!categoria) {
        throw new Error(`El id no existe ${id}`)
    }

}

const existeNombreCategoria = async (nombre = '') => {

    nombre = nombre.toUpperCase()

    const nombreCategoria = await Categoria.findOne({ nombre })

    if (nombreCategoria) {
        throw new Error(`La categoria ${nombre}, ya existe`)
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeNombreCategoria
}