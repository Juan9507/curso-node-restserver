const { Router } = require('express')
const { check } = require('express-validator')
const { crearCategoria, obtenerCategorias, obtenerCategoriaPorId, actualizarCategoria, borrarCategoria } = require('../controllers/categorias')
const { existeCategoriaPorId, existeNombreCategoria } = require('../helpers/db-validators')

const { validarCampos, validarJWT, tieneRole, esAdminRole } = require('../middlewares')

const router = Router()

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoriaPorId)

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( existeNombreCategoria),
    validarCampos
], crearCategoria)

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('nombre').custom( existeNombreCategoria),
    validarCampos
], actualizarCategoria)

// eliminar - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria )




module.exports = router