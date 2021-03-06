const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastro = (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ errror: error}) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, results) => {
            if (error) { return res.status(500).send({ errror: error}) }
            if(results.length > 0) {
                res.status(401).send({ mensagem: 'Usuário já cadastrado'})
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query('INSERT INTO usuarios (email, senha) VALUES (?,?)',
                    [req.body.email, hash],
                    (error, results) => {
                        conn.release();
                        if (error) { return res.status(500).send({ errror: error}) }
                        response = {
                            mensagem: 'Usuário criado com sucesso',
                            usuarioCriado: {
                                id_usuario: results.insertId,
                                email: req.body.email
                            }
                        }
                        return res.status(201).send(response);
                    }
                    )
                });
            }
        })       
    });
}

exports.login = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ errror: error}) }
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ errror: error}) }
            if (results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação'})
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação'});
                }
                if (result) {
                    let token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    }, process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });

                    return res.status(200).send({ 
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação'})
            });
        });
    });
}

exports.getUsuarios = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM usuarios;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ errror: error}) }
                const response = {
                    quantidade: result.length,
                    usuarios: result.map(prod => {
                        return {
                            id_usuario: prod.id_usuario,
                            email: prod.email
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    });
}