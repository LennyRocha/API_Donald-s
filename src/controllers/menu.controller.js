//Importación de la base de datos
const deadpool = require("../../db/db.js")

// menu.controller.js

//GET
exports.getMenu = async (req, res) => {
    try {
        const [rows] = await deadpool.query(`SELECT 
                productos.prod_id AS producto_id,
                productos.nombre AS producto_nombre,
                productos.descripcion AS producto_descripcion,
                productos.precio,
                productos.agregado,
                productos.disponible,
                categorias.cat_id AS categoria_id,
                categorias.nombre AS categoria_nombre,
                categorias.descripcion AS categoria_descripcion
            FROM productos
            JOIN categorias ON productos.categoria = categorias.cat_id`)

        if(rows.length <= 0) return res.status(200).json({
            codigo: '204',
            mensaje: '¡NO CONTENT!',
            dato:'Menú vacio amigo'
        })

        const productos = rows.map(row => ({
            id: row.producto_id,
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
        }));

        res.json(productos)
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
exports.getMenuName = async (req, res) => {
    try{
        const [rows] = await deadpool.query(`SELECT 
                p.prod_id AS producto_id,
                p.nombre AS producto_nombre,
                p.descripcion AS producto_descripcion,
                p.precio,
                p.agregado,
                p.disponible,
                c.cat_id AS categoria_id,
                c.nombre AS categoria_nombre,
                c.descripcion AS categoria_descripcion
            FROM productos p
            JOIN categorias c ON p.categoria = c.cat_id WHERE p.nombre = ?`,  [req.params.nombre])
            
        if(rows.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encontró el platillo solicitado'
        })

        if(rows.length > 1) return res.status(404).json({
            error: '418',
            mensaje: '¡I´M A TEAPOT!',
            dato:'Hay más de un platillo con ese nombre, buscalo con su ID en su lugar'
        })

        const productos = rows.map(row => ({
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
        }));

        res.json(productos)
    }catch(error){
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }

};

//GET con id
exports.getMenuId = async (req, res) => {
    try{
        const [rows] = await deadpool.query(`SELECT 
                p.prod_id AS producto_id,
                p.nombre AS producto_nombre,
                p.descripcion AS producto_descripcion,
                p.precio,
                p.agregado,
                p.disponible,
                c.cat_id AS categoria_id,
                c.nombre AS categoria_nombre,
                c.descripcion AS categoria_descripcion
            FROM productos p
            JOIN categorias c ON p.categoria = c.cat_id WHERE p.prod_id = ?`,  [req.params.id])
            
        if(rows.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encontró el platillo con el ID solicitado'
        })

        const productos = rows.map(row => ({
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
        }));

        res.json(productos)
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
exports.postMenu = async (req, res) => {
    try {
        const {nombre, descripcion, precio, agregado, categoria, disponible} = req.body
        const [categoriaRows] = await deadpool.query('SELECT * FROM categorias WHERE cat_id = ?', [categoria]); 
        const [elMenu] = await deadpool.query('SELECT nombre FROM productos');
        let i = 0;
        let repetido = false;

        console.log(elMenu.length)
        elMenu.forEach(plato => {
            if(nombre != plato) i ++;
            else repetido = true
        });

        console.log(i)

        if(i === elMenu.length) console.log("Ese platillo no existe")
        if(repetido) return res.status(400).json({ 
            error: '400', 
            mensaje: '¡BAD REQUEST¡', 
            dato: 'Ya existe un ptoducto con ese nombre.' 
        });

        if (categoriaRows.length === 0) { 
            return res.status(404).json({ 
                error: '404', 
                mensaje: '¡NOT FOUND!', 
                dato: 'Categoría no encontrada' 
            });
        }

        const categoriaData = categoriaRows[0];

        const [rows] = 
            await deadpool.query('INSERT INTO productos (nombre,descripcion,precio,agregado,categoria,disponible) VALUES (?,?,?,?,?,?)'
            ,[nombre, descripcion, precio, agregado, categoria, disponible])
        res.send({
            id: rows.insertId,
            nombre, 
            descripcion, 
            precio, 
            agregado, 
            categoria: { 
                id: categoriaData.id, 
                nombre: categoriaData.nombre, 
                descripcion: categoriaData.descripcion
            },
            disponible
        }); 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};

//PUT
exports.putMenu = async (req, res) => {
    try {
        const {nombre} = req.params
        const {descripcion, precio, agregado, categoria, disponible} = req.body

        let categoriaData; 
        if (categoria) { 
            const [categoriaRows] = await deadpool.query('SELECT * FROM categorias WHERE cat_id = ?', [categoria]); 
            if (categoriaRows.length === 0) { 
                return res.status(404).json({ 
                    error: '404', 
                    mensaje: '¡NOT FOUND!', 
                    dato: 'Categoría no encontrada' 
                });
            } 
            categoriaData = categoriaRows[0]; 
        }
        
        const [result] = await deadpool.query('UPDATE productos set descripcion = ?, precio = ?, agregado = ?, categoria = ?, disponible = ? WHERE nombre = ?'
            ,[descripcion, precio, agregado, categoria, disponible, nombre])
        if(result.affectedRows == 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No es posible actualizar el platillo'
        })

        const [rows] = await deadpool.query('SELECT * FROM productos WHERE nombre = ?', [req.params.nombre])
        if(rows.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encuentró el platillo solicitado'
        })
        res.json(rows[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};

//PATCH
exports.patchMenu = async (req, res) => {
    try {
        const {id} = req.params
        const {nombre, descripcion, precio, agregado, categoria, disponible} = req.body

        let categoriaData; 
        if (categoria) { 
            const [categoriaRows] = await deadpool.query('SELECT * FROM categorias WHERE cat_id = ?', [categoria]); 
            if (categoriaRows.length === 0) { 
                return res.status(404).json({ 
                    error: '404', 
                    mensaje: '¡NOT FOUND!', 
                    dato: 'Categoría no encontrada' 
                });
            } 
            categoriaData = categoriaRows[0]; 
        }

        const [result] = await deadpool.query('UPDATE productos set nombre = IFNULL(?,nombre), descripcion = IFNULL(?,descripcion), precio = IFNULL(?,precio), agregado = IFNULL(?,agregado), categoria = IFNULL(?,categoria), disponible = IFNULL(?,disponible) WHERE prod_id = ?'
            ,[nombre, descripcion, precio, agregado, categoria, disponible, id])
        if(result.affectedRows == 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No es posible actualizar el platillo'
        })
    
        const [rows] = await deadpool.query('SELECT * FROM productos WHERE nombre = ?', [req.params.id])
        if(rows.length <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'No se encuentró el platillo solicitado'
        })
        res.json(rows[0])
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
exports.deleteMenu = async (req, res) => {
    try {
        const [result] = await deadpool.query('DELETE * FROM productos WHERE nombre = ?', [req.params.nombre])
        if(result.affectedRows <= 0) return res.status(404).json({
            error: '404',
            mensaje: '¡NOT FOUND!',
            dato:'Producto no eliminado porque no existe'
        })
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: '500',
            mensaje: '¡INTERNAL SERVER ERROR!',
            dato:'Algo salió mal, intentalo nuevamente'
        })
    }
};