const express = require('express');
const rutas = express.Router();
const BD = require('../config/BD.js');

rutas.get('/Products', (req, res) => {
    if (BD) {
        let sql = 'select a.id_producto,b.id_categoria,b.nombre from PRODUCTOS a INNER JOIN CATEGORIAS B ON (a.id_producto = b.id_producto);';
        BD.query(sql, (err, PRODUCTOS) => {
            if (err) {
                res.send(err)
            } else {
                res.json(PRODUCTOS);
            }
        })
    }
}
);
rutas.get('/Categorias', (req, res) => {
    if (BD) {
        let sql = 'SELECT * FROM CATEGORIAS;';
        BD.query(sql, (err, rows) => {
            if (err) {
                res.json(err);
            } else {
                res.json(rows)
            }
        })

    }
});

rutas.get('/Solicitudes', (req, res) => {
    if (BD) {
        let sql = 'SELECT fecha,a.id_solicitud,a.id_pedido FROM solicitud a INNER JOIN pedidos b ON (a.id_pedido = b.id_pedido);';
        BD.query(sql, (err, SOLICITUD) => {
            if (err) {
                res.send(err)
            } else {
                res.json(SOLICITUD);
            }
        })
    }
}
);
module.exports = rutas;