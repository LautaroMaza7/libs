<?php
require_once ('../../db.php');

// Ejecutar la consulta SQL
$queryEventos = mysqli_query($conn, "
SELECT clientes.id, clientes.ingreso, clientes.perfil, CONCAT(clientes.nombre, ' ', clientes.apellido) AS full_name, CONCAT(clientes.direccion, ', ', clientes.localidad, ', ', clientes.provincia, ', ', clientes.pais) AS full_address, usuarios.username AS vendedor, seguimiento__estados.id AS estado_id FROM clientes LEFT JOIN usuarios ON clientes.asignado = usuarios.id INNER JOIN seguimiento__estados ON clientes.estado = seguimiento__estados.id ORDER BY clientes.id DESC
");

// Verificar si la consulta se ejecutó correctamente
if (!$queryEventos) {
    die('Error en la consulta: ' . mysqli_error($conn));
}

// Inicializar un array para almacenar los resultados
$resultados = [];

// Recorrer los resultados de la consulta
while ($fila = mysqli_fetch_assoc($queryEventos)) {
    $resultados[] = $fila;
}

// Convertir el array de resultados en formato JSON
$jsonResult = json_encode(['data' => $resultados]);

// Mostrar el JSON (o puedes guardarlo en un archivo o enviarlo como respuesta en una API)
echo $jsonResult;
?>