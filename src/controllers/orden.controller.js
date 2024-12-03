//Importación de la base de datos
const deadpool = require("../../db/db.js")

// orden.controller.js

//GET
exports.getOrdenes = async (req, res) => {
    try {
        const [rows] = await deadpool.query(`SELECT o.*, 
            o.orden_id AS num_orden, o.total AS total, o.fecha AS fecha,
            e.nombre AS encargado, e.emp_id,
                pr.prod_id AS producto_id,
                pr.nombre AS producto_nombre,
                pr.descripcion AS producto_descripcion,
                pr.precio,
                pr.agregado,
                pr.disponible,
            p.cantidad,
                c.cat_id AS categoria_id,
                c.nombre AS categoria_nombre,
                c.descripcion AS categoria_descripcion
            FROM ordenes o 
            JOIN empleados e ON o.empleado = e.emp_id
            JOIN pedidos p ON o.orden_id = p.orden
            JOIN productos pr ON p.producto = pr.prod_id
            JOIN categorias c ON pr.categoria = c.cat_id`)

        if(rows.length <= 0) return res.status(200).json({
            codigo: '2O4',
            mensaje: '¡NO CONTENT!',
            dato:'No hay ordenes disponibles'
        })

        const ordenes = rows.map(row => ({
            id: row.orden_id,
            total: row.total,
            fecha: row.fecha,
            precio: row.precio,
            empleado: {
                id: row.emp_id,
                nombre: row.encargado,
            },
            pedido: {
                producto:{
                    id: row.prod_id,
                    nombre: row.producto_nombre,
                    descripcion: row.producto_descripcion,
                    precio: row.precio,
                    agregado: row.agregado,
                    disponible: row.disponible,
                    categoria: {
                        id: row.categoria_id,
                        nombre: row.categoria_nombre,
                        descripcion: row.categoria_descripcion
                    }
                }
            }
        }))

        res.json([ordenes])
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};

//GET con nombre
exports.getOrden = async (req, res) => {
    try{
        const [rows] = await deadpool.query(`SELECT o.*, 
            o.orden_id AS num_orden, o.total AS total, o.fecha AS fecha,
            e.nombre AS encargado, e.emp_id,
                pr.prod_id AS producto_id,
                pr.nombre AS producto_nombre,
                pr.descripcion AS producto_descripcion,
                pr.precio,
                pr.agregado,
                pr.disponible,
            p.cantidad,
                c.cat_id AS categoria_id,
                c.nombre AS categoria_nombre,
                c.descripcion AS categoria_descripcion
            FROM ordenes o 
            JOIN empleados e ON o.empleado = e.emp_id
            JOIN pedidos p ON o.orden_id = p.orden
            JOIN productos pr ON p.producto = pr.prod_id
            JOIN categorias c ON pr.categoria = c.cat_id WHERE o.orden_id = ?`, [req.params.id])
        if(rows.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encontró tu orden'
        })
        //res.json(rows[0])
        res.json({
            numero:rows[0].num_orden,
            total:rows[0].total,
            fecha:rows[0].fecha,
            cantidad:rows[0].cantidad,
            encargado:{
                id: rows[0].emp_id,
                nombre: rows[0].encargado
            },
            productos:{
                id:rows[0].producto_id,
                nombre: rows[0].producto_nombre,
                descripcion: rows[0].producto_descripcion,
                precio: rows[0].precio,
                agregado: rows[0].agregado,
                disponible: rows[0].disponible,
                categoria : {
                    id: rows[0].categoria_id,
                    nombre : rows[0].categoria_nombre,
                    descripcion : rows[0].categoria_descripcion
                }
            }
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }

};

//POST
exports.postOrden = async (req, res) => {
    try {
        const { total, fecha, empleado, productos, cantidad } = req.body;
        const productosRows = [];

        // Verifica que `productos` es un array y contiene elementos
        if (!Array.isArray(productos) || productos.length === 0) {
            throw new Error("El valor de 'productos' es inválido o está vacío");
        }

        // Función para verificar la existencia de productos en la base de datos
        async function comprobarProductos() {
            try {
                console.log("Paso 1 - Verificando productos");

                // Usamos Promise.all para ejecutar todas las consultas de forma concurrente
                const results = await Promise.all(
                    productos.map(async (prod) => {
                        const productoNombre = prod.producto; // Accede al nombre del producto en cada iteración
                        const [rows] = await deadpool.query('SELECT * FROM productos WHERE nombre = ?', [productoNombre]);
                        
                        if (rows.length === 0) {
                            throw new Error(`El producto '${productoNombre}' no existe en la base de datos`);
                        }

                        return rows[0]; // Retornamos el primer producto encontrado
                    })
                );

                console.log("Paso 2 - Productos encontrados:", results);
                productosRows.push(...results);
                return true;
            } catch (error) {
                console.error("Error en comprobarProductos:", error.message);
                return false;
            }
        }

        // Verifica los productos antes de continuar con la creación de la orden
        const productosValidos = await comprobarProductos();
        if (!productosValidos) {
            return res.status(500).json({
                error: '500',
                mensaje: '¡INTERNAL SERVER ERROR!',
                dato: 'Algo salió mal, intentalo nuevamente'
            });
        }

        try {
            console.log("Paso 3 - Creando orden");

            // Crear la orden
            const [rowsOrden] = await deadpool.query(
                'INSERT INTO ordenes (total, fecha, empleado) VALUES (?,?,?)',
                [total, fecha, empleado]
            );

            if (rowsOrden.affectedRows <= 0) {
                return res.status(500).json({
                    error: '500',
                    mensaje: '¡INTERNAL SERVER ERROR!',
                    dato: 'No se pudo crear la orden'
                });
            }

            const idOrden = rowsOrden.insertId;

            const [raw] = (await deadpool.query('SELECT estado FROM ordenes WHERE orden_id = ?', [idOrden]));
            
            const estado = raw[0].estado;

            console.log("Paso 4 - Insertando productos en pedidos");

            const result = await Promise.all(
                productosRows.map(async (producto) => {
                    console.log("Procesando producto:", producto); // Depuración
            
                    if (!producto.prod_id) {
                        throw new Error(`Producto con nombre '${producto.nombre}' no tiene un ID válido.`);
                    }
            
                    const [rows] = await deadpool.query(
                        'INSERT INTO pedidos (precio, cantidad, orden, producto) VALUES (?,?,?,?)',
                        [producto.precio, cantidad, idOrden, producto.prod_id]
                    );
            
                    if (rows.affectedRows === 0) {
                        throw new Error(`No se pudo crear el pedido para el producto con ID ${producto.prod_id}`);
                    }

                    return {
                        productoId: producto.id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        ordenId: idOrden,
                        insertId: rows.insertId  // insertId del producto insertado
                    };
                })
            );            

            console.log("Paso 5 - Orden y productos creados con éxito");

            // Si todo ha salido bien, respondemos con éxito
            res.status(201).json({
                cosigo: '201',
                mensaje: '¡CREACIÓN EXITOSA!',
                datos: {
                    numero_orden: idOrden,
                    fecha: fecha,
                    total: total,
                    cantidad_productos: cantidad,
                    id_empleado : empleado,
                    estado: estado,
                    productos : result
                }
            });

        } catch (error) {
            console.error("Error al crear orden o insertar productos:", error.message);
            return res.status(500).json({
                error: '500',
                mensaje: '¡INTERNAL SERVER ERROR!',
                dato: 'Algo salió mal, intentalo nuevamente'
            });
        }
    } catch (error) {
        console.log("Error en postOrden:", error.message);
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato: 'Algo salió mal, intentalo nuevamente'
        });
    }
};

exports.patchOrden = async (req, res) => {
    try {
        const { total, fecha, empleado, productos, estado } = req.body;
        const productosRows = [];
        const pedidosRows = [];

        // Verifica que `productos` es un array y contiene elementos
        if (!Array.isArray(productos) || productos.length === 0) {
            throw new Error("El valor de 'productos' es inválido o está vacío");
        }

        // Función para verificar la existencia de productos en la base de datos
        async function comprobarProductos() {
            try {
                console.log("Paso 1 - Verificando productos");

                // Usamos Promise.all para ejecutar todas las consultas de forma concurrente
                const results = await Promise.all(
                    productos.map(async (prod) => {
                        const productoNombre = prod.producto; // Accede al nombre del producto en cada iteración
                        const [rows] = await deadpool.query('SELECT * FROM productos WHERE nombre = ?', [productoNombre]);
                        
                        if (rows.length === 0) {
                            throw new Error(`El producto '${productoNombre}' no existe en la base de datos`);
                        }

                        return rows[0]; // Retornamos el primer producto encontrado
                    })
                );

                console.log("Paso 2 - Productos encontrados:", results);
                productosRows.push(...results);
                return true;
            } catch (error) {
                console.error(error);
                console.error("Error en comprobarProductos:", error.message);
                return false;
            }
        }

        const productosValidos = await comprobarProductos();
        if (!productosValidos) {
            return res.status(500).json({
                error: '500',
                mensaje: '¡INTERNAL SERVER ERROR!',
                dato: 'Algo salió mal, intenta nuevamente'
            });
        }

        // Parcheo de orden
        const [rowsOrden] = await deadpool.query(
            'UPDATE ordenes SET total = IFNULL(?, total), fecha = IFNULL(?, fecha), empleado = IFNULL(?, empleado), estado = IFNULL(?, estado) WHERE orden_id = ?',
            [total, fecha, empleado, estado, req.params.id]
        );

        if (rowsOrden.affectedRows <= 0) {
            return res.status(404).json({
                error: '404',
                mensaje: '¡NOT FOUND!',
                dato: 'No se pudo encontrar la orden para actualizar'
            });
        }

        // ID de la orden
        const idOrden = req.params.id;

        // Actualización de los productos asociados al pedido
        const result = await Promise.all(
            pedidosRows.map(async (producto) => {
                const cantidadProducto = productos.find(p => p.id === producto.producto).cantidad;

                const [rows] = await deadpool.query(
                    'UPDATE pedidos SET precio = IFNULL(?, precio), cantidad = IFNULL(?, cantidad), orden_id = IFNULL(?, orden_id), producto = IFNULL(?, producto) WHERE pedido_id = ?',
                    [producto.precio, cantidadProducto, idOrden, producto.producto, producto.pedido_id]
                );

                if (rows.affectedRows === 0) {
                    throw new Error(`No se pudo actualizar el pedido para el producto con ID ${producto.producto}`);
                }
                return rows;
            })
        );

        // Respuesta exitosa
        res.status(201).json({
            codigo: '201',
            mensaje: '¡PARCHEO EXITOSO!',
            dato: "Orden actualizada" 
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato: 'Algo salió mal, intentalo nuevamente'
        });
    }
};

//CAMBIAR EL ESTADO DEL PEDIDO
/**
 * Solo lo puede hacer el empleado
 * Los estados solo pueden ser:
 *  pendiente (por defecto),
 *  en preparación,
 *  listo,
 *  entregado (Ya se puede eliminar)
 *  cancelado (tambien se pueden eliminar)
 */
exports.patchEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        const [result] = await deadpool.query('UPDATE ordenes SET estado = ? WHERE orden_id = ?', [estado, req.params.id])
        if(result.affectedRows <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se pudo actualizar el estado de la orden'
        })      
        res.sendStatus(204).json({
            mensaje:`La orden tiene el estado: ${estado}`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};

//DELETE
exports.deleteOrden = async (req, res) => {
    try {
        const [result] = await deadpool.query('DELETE * FROM ordenes WHERE orden_id = ?', [req.params.id])
        const [results] = await deadpool.query('DELETE * FROM pedidos WHERE orden_id = ?', [req.params.id])
        if(result.affectedRows <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se pudo entregar tu orden'
        })
        if(results.affectedRows <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se pudo finalizar tu pedido'
        })        
        res.sendStatus(204).json({
            mensaje:"Tu orden ha sido entrgada, provecho"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};