	create database apiDonalds;

	use apiDonalds;

	create table categorias(
		cat_id int not null auto_increment primary key,
		nombre varchar(20) not null,
		descripcion varchar(100) not null
	);

	create table productos(
		prod_id int not null auto_increment primary key,
		nombre varchar(20) not null,
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
		correo varchar(50) not null,
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
	 ir_rep int not null auto_increment primary key,
	 fecha date not null,
	 ventas_totales float not null,
	 producto_mas_vendido int not null,
	 mejor_empleado int not null,
     foreign key (producto_mas_vendido) references productos (prod_id),
     foreign key (mejor_empleado) references empleados (emp_id)
	);