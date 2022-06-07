const express = require('express');
const rutas = express.Router();
const BD = require('../config/BD.js');
const path = require("path");
const { execFile, exec, spawn } = require("child_process");

rutas.post('/python', function (req, res) {
    const subprocess = spawn("python", [
        path.join('./python/Pedidos.py'),
    ]);
    subprocess.on("close", (code) => {
        res.json(code)
    })
});

rutas.get('/Categorias', (req, res) => {
    if (BD) {
        let sql = 'CALL sp_getCategories();';
        BD.query(sql, (err, rows) => {
            if (err) {
                res.json(err);
            } else {
                res.json(rows)
            }
        })

    }
});

rutas.post('/products-cat/:ID', (req, res) => {
    if (BD) {
        const id = req.params.ID;
        if (!id) {
            return res.status(400).send({ error: true, mensaje: "El id de la categorias es obligatoria" })
        }
        let sql = 'CALL sp_getProductsByCategory(?);';
        BD.query(sql, [id], (err, rows) => {
            if (err) {
                res.json(err);
            } else {
                res.json(rows)
            }
        })

    }
});

rutas.post('/detalles-pedidos/:ID', (req, res) => {
    if (BD) {
        const id = req.params.ID;
        if (!id) {
            return res.status(400).send({ error: true, mensaje: "El ID_PEDIDO es obligatorio" })
        }
        let sql = 'SELECT a.ID_PEDIDO,FECHA_PEDIDO,FECHA_ENTREGA,FECHA_SOLICITUD,ID_CLIENTE,ID_ESTADO,b.ID_SOLICITUD,ID_PRODUCTO,CANTIDAD,TIPO_MEDIDA FROM pedidos a INNER JOIN solicitudes b ON (a.ID_SOLICITUD = b.ID_SOLICITUD) INNER JOIN detalle_solicitudes c ON (b.ID_SOLICITUD = c.ID_SOLICITUD) WHERE a.ID_PEDIDO = ?;';
        BD.query(sql, [id], (err, rows) => {
            if (err) {
                res.json(err);
            } else {
                res.json(rows)
            }
        })
    }
});

rutas.post('/detalles-products/:id', (req, res) => {
    if (BD) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({ error: true, mensaje: "El ID_PRODUCTO es obligatorio" })
        }
        let sql = 'CALL sp_getProductInfo(?)';
        BD.query(sql, [id], (err, rows) => {
            if (err) {
                res.json(err);
            } else {
                res.json(rows[0])
            }
        })

    }
});

rutas.get('/pedidos/:id', (req, res) => {
    if (BD) {
        const id = req.params.id;
        let sql = 'SELECT DISTINCT(ID_PEDIDO),FECHA_PEDIDO,FECHA_ENTREGA,STATUS FROM pedidos WHERE STATUS = ?;';
        BD.query(sql, [id], (err, rows) => {
            if (err) {
                res.send(err)
            } else {
                res.json(rows);
            }
        })
    }
}
);

rutas.post('/Login', (req, res) => {
    if (BD) {
        const usuario = req.body;
        if (!usuario.user) {
            return res.status(400).send({ error: true, mensaje: "El usuario es obligatorio" })
        }
        if (!usuario.pass) {
            return res.status(400).send({ error: true, mensaje: "La PASSWORD es obligatoria" })
        }
        let sql = 'SELECT LoginApp(?,?) AS response;';
        BD.query(sql, [usuario.user, usuario.pass], (err, rows) => {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        })
    }
});

rutas.post('/Login2', (req, res) => {
    if (BD) {
        const usuario = req.body;
        if (!usuario.user) {
            return res.status(400).send({ error: true, mensaje: "El usuario es obligatorio" })
        }
        if (!usuario.pass) {
            return res.status(400).send({ error: true, mensaje: "La PASSWORD es obligatoria" })
        }
        let sql = 'SELECT LoginEmpleados(?,?) as respuesta';
        BD.query(sql, [usuario.user, usuario.pass], (err, rows) => {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        })
    }
});

rutas.put('/Act-Estado-Prod/:ID', (req, res) => {
    if (BD) {
        const id = req.params.ID;
        const CANTIDAD = req.body.CANTIDAD;
        const ESTADO = req.body.ESTADO;
        const ID_SOLICITUD = req.body.ID_SOLICITUD;

        let sql = `update detalle_solicitudes set CANTIDAD = ${CANTIDAD}, ESTADO = ${ESTADO} WHERE ID_SOLICITUD = ${ID_SOLICITUD} AND ID_PRODUCTO = ${id};`;
        console.log(sql)
        BD.query(sql, (err, rows) => {
            if (err) {
                res.send(err)
            } else {
                res.json(rows);
            }
        })
    }
}
);

rutas.put('/Act-Estado-Pedido/:ID', (req, res) => {
    if (BD) {
        const id = req.params.ID;
        const ID_PEDIDO = req.body.ID_PEDIDO;
        if (!ID_PEDIDO) {
            return res.status(400).send({ error: true, mensaje: "El ID_PEDIDO es obligatorio" })
        }
        let sql = 'update pedidos set STATUS = ? WHERE ID_PEDIDO = ?;';
        BD.query(sql, (err, rows) => {
            if (err) {
                res.send(err)
            } else {
                res.json(rows);
            }
        })
    }
}
);

rutas.put('/Act-Estado-Pedido-DIST/:ID', (req, res) => {
    if (BD) {
        const id = req.params.ID;
        if (!id) {
            return res.status(400).send({ error: true, mensaje: "El ID_PEDIDO es obligatorio" })
        }
        let sql = `update pedidos set STATUS = 3, FECHA_ENTREGA = NOW() WHERE ID_PEDIDO = ${id};`;
        BD.query(sql, [id], (err, rows) => {
            if (err) {
                res.send(err)
            } else {
                res.json(rows);
            }
        })
    }
}
);

rutas.post('/Cliente/:id', (req, res) => {
    if (BD) {
        const ID = req.params.id;
        let sql = 'SELECT ID_CLIENTE,ID_USUARIO,NOMBRE_EMPRESA,RFC,EMAIL,TELEFONO,DOMICILIO,CIUDAD FROM clientes WHERE ID_USUARIO = ?;';
        BD.query(sql, [ID], (err, rows) => {
            if (err) {
                res.send(err)
            } else {
                res.json(rows);
            }
        })
    }
}
);

rutas.get('/Historial-cliente/:id', (req, res) => {
    if (BD) {
        const id = req.params.id;
        let sql = `SELECT 
        P.ID_PEDIDO,S.ID_SOLICITUD,P.FECHA_PEDIDO,P.FECHA_ENTREGA,P.STATUS,DS.ID_PRODUCTO,DP.NOMBRE,DS.CANTIDAD,
        DS.TIPO_MEDIDA,C.ID_CLIENTE,C.NOMBRE_EMPRESA,C.RFC,C.EMAIL,C.TELEFONO,C.DOMICILIO,C.CIUDAD
        FROM
            pedidos P 
            INNER JOIN solicitudes S ON (P.ID_SOLICITUD = S.ID_SOLICITUD) 
            INNER JOIN detalle_solicitudes DS ON (S.ID_SOLICITUD = DS.ID_SOLICITUD)
            INNER JOIN detalle_productos DP ON (DP.ID_PRODUCTO = DS.ID_PRODUCTO)
            INNER JOIN clientes C ON (S.ID_CLIENTE = C.ID_CLIENTE) 
            WHERE C.ID_CLIENTE = ${id} AND P.STATUS = 3;`;
        BD.query(sql, (err, rows) => {
            if (err) {
                res.send(err)
            } else {
                var cont = 0;
                var array =
                {
                    ID_CLIENTE: rows[0]['ID_CLIENTE'],
                    NOMBRE_EMPRESA: rows[0]['ID_CLIENTE'],
                    RFC: rows[0]['RFC'],
                    EMAIL: rows[0]['EMAIL'],
                    DOMICILIO: rows[0]['DOMICILIO'],
                    CIUDAD: rows[0]['CIUDAD'],
                    PEDIDOS: []
                };
                for (let i = 0; i < rows.length; i++) {
                    if (i == 0) {
                        array.PEDIDOS.push({
                            ID_PEDIDO: rows[i]['ID_PEDIDO'],
                            FECHA_PEDIDO: new Date(rows[i]['FECHA_PEDIDO']).toISOString().substring(0,10),
                                FECHA_ENTREGA: new Date(rows[i]['FECHA_ENTREGA']).toISOString().substring(0,10),
                            STATUS: rows[i]['STATUS'],
                            PRODUCTOS: [{
                                ID_PRODUCTO: rows[i]['ID_PRODUCTO'],
                                NOMBRE: rows[i]['NOMBRE'],
                                CANTIDAD: rows[i]['CANTIDAD'],
                                TIPO_MEDIDA: rows[i]['TIPO_MEDIDA'],
                            }]
                        });
                        continue;
                    }
                    if (i != 0) {
                        if (rows[i]['ID_PEDIDO'] != rows[i - 1]['ID_PEDIDO']) {
                            cont++;
                            array.PEDIDOS.push({
                                ID_PEDIDO: rows[i]['ID_PEDIDO'],
                                FECHA_PEDIDO: new Date(rows[i]['FECHA_PEDIDO']).toISOString().substring(0,10),
                                FECHA_ENTREGA: new Date(rows[i]['FECHA_ENTREGA']).toISOString().substring(0,10),
                                STATUS: rows[i]['STATUS'],
                                PRODUCTOS: [{
                                    ID_PRODUCTO: rows[i]['ID_PRODUCTO'],
                                    NOMBRE: rows[i]['NOMBRE'],
                                    CANTIDAD: rows[i]['CANTIDAD'],
                                    TIPO_MEDIDA: rows[i]['TIPO_MEDIDA'],
                                }]
                            });
                        }
                    }
                    array.PEDIDOS[cont].PRODUCTOS.push({
                        ID_PRODUCTO: rows[i]['ID_PRODUCTO'],
                        NOMBRE: rows[i]['NOMBRE'],
                        CANTIDAD: rows[i]['CANTIDAD'],
                        TIPO_MEDIDA: rows[i]['TIPO_MEDIDA'],
                    });
                }
                res.json(array);
            }
        })
    }
}
);

rutas.get('/Historial-distribuidor', (req, res) => {
    if (BD) {
        const id = req.params.id;
        let sql = `SELECT 
        P.ID_PEDIDO,S.ID_SOLICITUD,P.FECHA_PEDIDO,P.FECHA_ENTREGA,P.STATUS,DS.ID_PRODUCTO,DP.NOMBRE,DS.CANTIDAD,
        DS.TIPO_MEDIDA,C.ID_CLIENTE,C.NOMBRE_EMPRESA,C.RFC,C.EMAIL,C.TELEFONO,C.DOMICILIO,C.CIUDAD
        FROM
            pedidos P 
            INNER JOIN solicitudes S ON (P.ID_SOLICITUD = S.ID_SOLICITUD) 
            INNER JOIN detalle_solicitudes DS ON (S.ID_SOLICITUD = DS.ID_SOLICITUD)
            INNER JOIN detalle_productos DP ON (DP.ID_PRODUCTO = DS.ID_PRODUCTO)
            INNER JOIN clientes C ON (S.ID_CLIENTE = C.ID_CLIENTE) 
            WHERE P.STATUS = 3;`;
        BD.query(sql, (err, rows) => {
            if (err) {
                res.send(err)
            } else {
                var cont = 0;
                var cliente = 0;
                var array = [];
                for (let i = 0; i < rows.length; i++) {
                    if (i == 0) {
                        array.push({
                            ID_CLIENTE: rows[i]['ID_CLIENTE'],
                            NOMBRE_EMPRESA: rows[i]['ID_CLIENTE'],
                            RFC: rows[i]['RFC'],
                            EMAIL: rows[i]['EMAIL'],
                            DOMICILIO: rows[i]['DOMICILIO'],
                            CIUDAD: rows[i]['CIUDAD'],
                            PEDIDOS: [{
                                ID_PEDIDO: rows[i]['ID_PEDIDO'],
                                FECHA_PEDIDO: new Date(rows[i]['FECHA_PEDIDO']).toISOString().substring(0,10),
                                FECHA_ENTREGA: new Date(rows[i]['FECHA_ENTREGA']).toISOString().substring(0,10),
                                STATUS: rows[i]['STATUS'],
                                PRODUCTOS: [{
                                    ID_PRODUCTO: rows[i]['ID_PRODUCTO'],
                                    NOMBRE: rows[i]['NOMBRE'],
                                    CANTIDAD: rows[i]['CANTIDAD'],
                                    TIPO_MEDIDA: rows[i]['TIPO_MEDIDA'],
                                }]
                            }]
                        });
                        continue;
                    }
                    if (i != 0) {
                        if (rows[i]['ID_CLIENTE'] != rows[i - 1]['ID_CLIENTE']) {
                            cliente++;
                            array.push({
                                ID_CLIENTE: rows[i]['ID_CLIENTE'],
                                NOMBRE_EMPRESA: rows[i]['ID_CLIENTE'],
                                RFC: rows[i]['RFC'],
                                EMAIL: rows[i]['EMAIL'],
                                DOMICILIO: rows[i]['DOMICILIO'],
                                CIUDAD: rows[i]['CIUDAD'],
                                PEDIDOS: [{
                                    ID_PEDIDO: rows[i]['ID_PEDIDO'],
                                    FECHA_PEDIDO: new Date(rows[i]['FECHA_PEDIDO']).toISOString().substring(0,10),
                                FECHA_ENTREGA: new Date(rows[i]['FECHA_ENTREGA']).toISOString().substring(0,10),
                                    STATUS: rows[i]['STATUS'],
                                    PRODUCTOS: [{
                                        ID_PRODUCTO: rows[i]['ID_PRODUCTO'],
                                        NOMBRE: rows[i]['NOMBRE'],
                                        CANTIDAD: rows[i]['CANTIDAD'],
                                        TIPO_MEDIDA: rows[i]['TIPO_MEDIDA'],
                                    }]
                                }]
                            });
                            continue;
                        }
                        if (rows[i]['ID_PEDIDO'] != rows[i - 1]['ID_PEDIDO']) {
                            cont++;
                            array[cliente].PEDIDOS.push({
                                ID_PEDIDO: rows[i]['ID_PEDIDO'],
                                FECHA_PEDIDO: new Date(rows[i]['FECHA_PEDIDO']).toISOString().substring(0,10),
                                FECHA_ENTREGA: new Date(rows[i]['FECHA_ENTREGA']).toISOString().substring(0,10),
                                STATUS: rows[i]['STATUS'],
                                PRODUCTOS: [{
                                    ID_PRODUCTO: rows[i]['ID_PRODUCTO'],
                                    NOMBRE: rows[i]['NOMBRE'],
                                    CANTIDAD: rows[i]['CANTIDAD'],
                                    TIPO_MEDIDA: rows[i]['TIPO_MEDIDA'],
                                }]
                            });
                        }

                    }
                    array[cliente].PEDIDOS[cont].PRODUCTOS.push({
                        ID_PRODUCTO: rows[i]['ID_PRODUCTO'],
                        NOMBRE: rows[i]['NOMBRE'],
                        CANTIDAD: rows[i]['CANTIDAD'],
                        TIPO_MEDIDA: rows[i]['TIPO_MEDIDA'],
                    });
                }
                res.json(array);
            }
        })
    }
}
);

rutas.post('/Registra-pedido', (req, res) => {
    if (BD) {
        const ID = req.params.id;
        const Array = req.body;
        const Cliente = Array.UserId;
        const Productos =Array.ProductList;
        var productos= '';
        var cantidades= ''
        for (let i = 0; i < Productos.length; i++) {
            productos = productos + Productos[i].Idprod + ',';
            cantidades = cantidades + Productos[i].Cantidad + ',';
        }
        let sql = `call LevantarPedido(${Cliente},'${productos}','${cantidades}')`;
        BD.query(sql, (err, rows) => {
            if (err) {
                res.send(err)
            } else {
                res.json({response: 1});
            }
        })
    }
}
);

module.exports = rutas;