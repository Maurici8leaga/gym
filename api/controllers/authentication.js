const jwt = require('jwt-simple'); // <-- esto ayudara a crear los token
const User = require('../models/user');
const config = require('../config'); // <- dentro se encuentra el string de seguridad

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    // para poder obtener la fecha de la creacion del usuario
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
    // este "sub" es una convencion de la libreria en la que su finalidad es designar aquien ira esta function, en nuestro caso al "user.id". ESTO SE CONVIERTE EN EL PAYLOAD DEL TOKEN
    // encode lo que hace es codificar el token, "config.secret" aca es una frase pero debe ser un algoritmo 
}

exports.signin = function (req, res, next) {
    // ya que el usuario ya tiene su password del email de autenticada, entonces hay que darle un token
    res.send({ token: tokenForUser(req.user) });
    // el "user" de aqui se almacena el email del user ya que se guarda en el memoria de el y podemos acceder
}

exports.signup = function (req, res, next) {

    const { email, password, name, lastname, age, height, sex, weight } = req.body;

    if (!sex) {
        return res.status(422).send({ error: { msg: 'Debes colocar tu sexo' } })
    }

    if (!age) {
        return res.status(422).send({ error: { msg: 'Debes colocar tu edad' } })
    }

    if (!height || !weight) {
        return res.status(422).send({ error: { msg: 'Debes colocar Peso y Altura' } })
    }

    if (!name || !lastname) {
        return res.status(422).send({ error: { msg: 'Debes colocar Nombre y Apellido' } })
    }

    if (!email || !password) {
        return res.status(422).send({ error: { msg: 'Debes colocar email y password' } });
    }

    // veremos si un usario tiene un email existente
    User.findOne({ email }, function (err, existingUser) {
        if (err) { return next(err) }

        // si  el email del usuario existe, regresa un error
        if (existingUser) {
            return res.status(422).send({ error: { msg: 'Este email ya existe' } });
            // se envia el mensaje del error con un status 422 en el cual no ejecuta la solicitud
        }
        // si el email del usuario no existe, se crea y se guarda en la "data-base"
        const user = new User({
            email,
            password,
            name,
            lastname,
            age,
            height,
            weight,
            sex
        });

        user.save(function (err) {
            if (err) { 
                return next(err);
            }else {
                // res.send({ msg: 'Usuario creado exitosamente!' })
                // se responde que el usuario fue creado
                res.json({ token: tokenForUser(user), msg: 'Usuario creado exitosamente!' });
                                            //al colocar "msg" dentro de este json igual se envia el mensaje y aparece el alertmessage. si se intenta enviar enviar por fuera de este json
                                            // ocurre un crach en el server 
            }

        });
    });
}