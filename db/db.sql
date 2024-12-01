	create database apiDonalds;

	use apiDonalds;

	create table categorias(
		cat_id int not null auto_increment primary key,
		nombre varchar(20) not null unique,
		descripcion varchar(100) not null
	);

	create table productos(
		prod_id int not null auto_increment primary key,
		nombre varchar(20) not null unique,
		descripcion varchar(100) not null,
		precio float not null,
		agregado varchar(20) not null,
		categoria int not null,
		foreign key (categoria) references categorias(cat_id),
		disponible boolean not null
	);

	create table empleados(
		emp_id int not null auto_increment primary key,
		nombre varchar(20) not null,
		correo varchar(50) not null unique,
		contra varchar(256) not null
	);

    create table ordenes(
		orden_id int not null auto_increment primary key,
		total float not null,
		fecha date not null,
		empleado int not null,
        estado varchar (20) not null default 'Pendiente',
		foreign key (empleado) references empleados(emp_id)
	);

	-- Tabla de relación muchos a muchos
	create table pedidos(
		pedido_id int not null auto_increment primary key,
		precio float not null,
		cantidad int not null,
		orden int not null,
		producto int not null,
		foreign key (orden) references ordenes(orden_id),
		foreign key (producto) references productos(prod_id)
	);
    
	create table feedback(
		fed_id int not null primary key,
		producto int not null,
		foreign key (producto) references productos(prod_id),
		comentario varchar (100) not null,
		Usuario varchar (20) not null,
		calificacion int not null
	);

	create table reportes_diarios(
	 id_rep int not null auto_increment primary key,
	 fecha date not null,
	 ventas_totales float not null,
	 producto_mas_vendido int not null,
	 mejor_empleado int not null,
     foreign key (producto_mas_vendido) references productos (prod_id),
     foreign key (mejor_empleado) references empleados (emp_id)
	);

DELIMITER $$

CREATE EVENT calcular_reportes_diarios
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
BEGIN
    -- Variables para almacenar resultados temporales
    DECLARE total_ganancias FLOAT;
    DECLARE producto_mas_vendido INT;
    DECLARE mejor_empleado INT;

    -- Calcular ganancias totales del día
    SELECT SUM(p.cantidad * p.precio)
    INTO total_ganancias
    FROM pedidos p
    INNER JOIN ordenes o ON p.orden = o.orden_id
    WHERE DATE(o.fecha) = CURDATE();

    -- Obtener el producto más vendido del día
    SELECT p.producto
    INTO producto_mas_vendido
    FROM pedidos p
    INNER JOIN ordenes o ON p.orden = o.orden_id
    WHERE DATE(o.fecha) = CURDATE()
    GROUP BY p.producto
    ORDER BY SUM(p.cantidad) DESC
    LIMIT 1;

    -- Obtener el empleado con más órdenes del día
    SELECT o.empleado
    INTO mejor_empleado
    FROM ordenes o
    WHERE DATE(o.fecha) = CURDATE()
    GROUP BY o.empleado
    ORDER BY COUNT(o.orden_id) DESC
    LIMIT 1;

    -- Insertar el reporte diario en la tabla
    INSERT INTO reportes_diarios (fecha, ventas_totales, producto_mas_vendido, mejor_empleado)
    VALUES (CURDATE(), total_ganancias, producto_mas_vendido, mejor_empleado);
END$$

DELIMITER ;