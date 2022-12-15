const { Router } = require('express')
const { check } = require('express-validator')
const { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, borrarProducto } = require('../controllers/productos')
const { existeCategoriaPorId, existeProductoPorId, existeNombreProducto } = require('../helpers/db-validators')

const { validarCampos, validarJWT, tieneRole, esAdminRole } = require('../middlewares')

const router = Router()

/**
 * {{url}}/api/productos
 */

// Obtener todos los productos
router.get('/', obtenerProductos)

// Obtener un producto por id
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProductoPorId)

// Crear producto - privado - cualquier persona con un yoken
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( existeNombreProducto ),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'la categoria No es un ID válido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto)

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre').custom( existeNombreProducto ),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], actualizarProducto)

// eliminar - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto)

module.exports = router