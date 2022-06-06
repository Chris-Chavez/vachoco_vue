#!/usr/bin/python

import pymysql

def main():
    try:
        miConexion = pymysql.connect(host='db-mysql-vachoco-do-user-11722385-0.b.db.ondigitalocean.com',
                                     user='vachoco',
                                     passwd='AVNS_us4oegE2Ppp_4Rm',
                                     db='vachoco',
                                     port=25060)
        cur = miConexion.cursor()
        sql = "SELECT ID_PEDIDO,FECHA_PEDIDO FROM pedidos WHERE STATUS = 1;"
        cur.execute(sql)
        pedidos = cur.fetchall()
        for pedido in pedidos:
            sql = 'SELECT a.ID_PEDIDO,FECHA_PEDIDO,FECHA_SOLICITUD,ID_CLIENTE,ID_ESTADO,b.ID_SOLICITUD,' \
                  'ID_PRODUCTO,CANTIDAD FROM pedidos a INNER JOIN solicitudes b ON (a.ID_SOLICITUD = ' \
                  'b.ID_SOLICITUD) INNER JOIN detalle_solicitudes c ON (b.ID_SOLICITUD = c.ID_SOLICITUD) WHERE ' \
                  'a.ID_PEDIDO = %i;' % pedido[0]
            cur.execute(sql)
            detalles = cur.fetchall()
            band = True
            for detalle in detalles:
                sql = 'CALL sp_getProductInfo(%i)' % detalle[6]
                cantidad = detalle[7]
                cur.execute(sql)
                product = cur.fetchall()
                existencia = product[0][4]
                if cantidad > existencia:
                    band = False

            if band:
                for detalle in detalles:
                    sql = 'update detalle_solicitudes set CANTIDAD = %i, ESTADO = 2 WHERE ID_SOLICITUD = %i AND ' \
                          'ID_PRODUCTO = %i;' % (detalle[7], detalle[5], detalle[6])
                    cur.execute(sql)
                    miConexion.commit()

        miConexion.close()
    except Exception as error:
        print(error)


main()
