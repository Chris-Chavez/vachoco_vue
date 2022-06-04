const express = require('express');
const rutas = express.Router();
const BD = require('../config/BD.js');
const path = require("path");
const { execFile, exec, spawn } = require("child_process");

rutas.post('/python', function (req, res) {
    const subprocess = spawn("python", [
        path.join('../Ejecutables/Pedidos.py'),
    ]);
    subprocess.on("close", (code) => {
        res.json(1)
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
        let sql = 'SELECT ID_PEDIDO,FECHA_PEDIDO,FECHA_ENTREGA,STATUS FROM pedidos WHERE STATUS = ?;';
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
        let sql = 'CALL sp_login(?,?)';
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
        const ID_PEDIDO = req.body.ID_PEDIDO;
        if (!ID_PEDIDO) {
            return res.status(400).send({ error: true, mensaje: "El ID_PEDIDO es obligatorio" })
        }
        let sql = 'update pedidos set STATUS = 3, FECHA_ENTREGA = NOW() WHERE ID_PEDIDO = ?;';
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

module.exports = rutas;