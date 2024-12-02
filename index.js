const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = process.env.MYSQL_ADDON_PORT || 3000;
const session = require('express-session');

const db = require('./db/conexion');
const dotenv = require('dotenv/config');
app.use(express.json());
app.use(express.static('./public'));
app.use(cors());

app.use(session({
    secret: '4', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';  

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error de lectura' });
        }

        res.json(result);  
    });
});

app.post('/productos', (req, res) => {
    console.log('Datos recibidos:', req.body);

    const { nombre, descripcion, precio, imagen } = req.body;
    
    const sql = 'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [nombre, descripcion, precio, imagen], (err, result) => {
        if (err) {
            console.error('Error al guardar el producto:', err);
            return res.status(500).json({ error: 'Error al guardar el producto' });
        }

        console.log('Producto insertado:', result);
        res.json({ mensaje: 'Nuevo producto agregado' });
    });
});

app.delete('/productos/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM productos WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el producto:', err);
            return res.status(500).json({ error: 'Error al eliminar el producto' });
        }

        console.log('Producto eliminado:', result);
        res.json({ mensaje: 'Producto eliminado' });
    });
});

app.put('/productos', (req, res) => {
    const { id, nombre, descripcion, precio, imagen } = req.body;

    const sql = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?';

    db.query(sql, [nombre, descripcion, precio, imagen, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el producto:', err);
            return res.status(500).json({ error: 'Error al actualizar el producto' });
        }

        console.log('Producto actualizado:', result);
        res.json({ mensaje: 'Producto actualizado', data: result });
    });
});


app.post('/usuario', (req, res) => {
    const values = Object.values(req.body);
    const sql = "INSERT INTO usuarios (nombre, contraseña, id_tip_usu) VALUES (?, ?, ?)";
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al guardar usuario:', err);
            return res.json({ mensaje: "Error al guardar usuario" });
        }
        res.json({ mensaje: "Cuenta registrada" });
    });
});

app.post('/login', (req, res) => {
    const { nombre, contraseña } = req.body;

    if (!nombre || !contraseña) {
        return res.status(400).json({ mensaje: 'Faltan datos' });
    }

    const query = 'SELECT * FROM usuarios WHERE nombre = ?';
    db.query(query, [nombre], (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al realizar la consulta' });
        }

        if (results.length === 0) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuario = results[0];

        if (contraseña === usuario.contraseña) {
            req.session.userId = usuario.id;  
            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({ mensaje: 'Error al guardar la sesión' });
                }
                return res.status(200).json({
                    mensaje: 'Login exitoso',
                    id: usuario.id,
                    nombre: usuario.nombre,
                    id_tip_usu: usuario.id_tip_usu
                });
            });
        } else {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }
    });
});



app.post('/modificarContra', (req, res) => {
    const { contraseñaActual, nuevaContraseña } = req.body;

    console.log("Datos recibidos: ", req.body);  

    if (!contraseñaActual || !nuevaContraseña || !req.session.userId) {
        console.log("Faltan datos: ", { contraseñaActual, nuevaContraseña, userId: req.session.userId });
        return res.json({ mensaje: "Faltan datos: contraseña actual, nueva contraseña o ID de usuario en sesión." });
    }

    const usuarioId = req.session.userId;

    const query = 'SELECT contraseña FROM usuarios WHERE id = ?';
    db.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.log("Error en la base de datos: ", err);
            return res.json({ mensaje: "Error al consultar la base de datos." });
        }

        if (results.length === 0) {
            console.log("Usuario no encontrado.");
            return res.json({ mensaje: "Usuario no encontrado." });
        }

        if (contraseñaActual !== results[0].contraseña) {
            console.log("Contraseña actual incorrecta.");
            return res.json({ mensaje: "La contraseña actual es incorrecta." });
        }

        const updateQuery = 'UPDATE usuarios SET contraseña = ? WHERE id = ?';
        db.query(updateQuery, [nuevaContraseña, usuarioId], (err, result) => {
            if (err) {
                console.log("Error al actualizar la contraseña: ", err);
                return res.json({ mensaje: "Error al actualizar la contraseña." });
            }

            console.log("Contraseña actualizada correctamente.");
            return res.json({ mensaje: "Contraseña cambiada correctamente." });
        });
    });
});

app.post('/eliminar', (req, res)=>{
    const {contraseña} = req.body
    console.log(contraseña)
    const sql = 'DELETE FROM usuarios WHERE contraseña = ?';
    db.query(sql, [contraseña], (err, results) => {
        if(err){
            console.error('error al buscar el usuario')
        }
        if(results.affectedRows === 0){
            console.error('usuario no encontrado')
        }
        res.json({ mensaje: "cuenta borrada con éxito" });
    })
})


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
