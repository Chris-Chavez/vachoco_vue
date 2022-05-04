#!/usr/bin/python

import pymysql

class Pedido():
    pedido = 0
    cantidad = 0
    existencia = 0
    estatus = None
    def __init__(self, id, cantidadS,cantidadE):
        self.pedido = id
        self.cantidad = cantidadS
        self.existencia = cantidadE
        
    def validaexistencia(self):
        return (self.existencia - self.cantidad) >= 0

    def nuevaExistencia(self):
        return (self.existencia - self.cantidad)

def main():
    try:
        miConexion = pymysql.connect( host='localhost', user= 'USUARIO', passwd='PASS', db='example' )
        cur = miConexion.cursor()
        cur.execute("SELECT a.id_pedido,b.id_producto,b.cantidad,c.cantidad as existencia FROM solicitud a INNER JOIN pedidos b ON (a.id_pedido = b.id_pedido) \
        INNER JOIN productos ON (b.id_producto=c.id_producto);")
        aux:list = []
        id = 0
        id1 = 0
        id2 = 0
        for id_pedido,id_producto,cantidad,existencia in cur.fetchall():
            aux2:list= None
            id1=id_pedido
            if id1 != id2:
                aux.append(id_pedido,aux2)
            else:
                aux2.append(Pedido(id_producto,cantidad,existencia))
            id2 = id1
        for pedido in aux:
            for item in pedido[1]:
                if item.validaexistencia():
                    cur.execute("UPDATE pedidos set estatus = 1 where id_pedido = %i and id_producto = %i;" % (pedido[0],item.pedido))
                
        miConexion.close()
    except Exception as error:
        print(error)
    