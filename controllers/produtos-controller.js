const mysql = require('../mysql').pool;

exports.getProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ errror: error}) }
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto especifico',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto
                            }
                        }
                    })
                }
                return res.status(200).send({response})
            }
        )
    });
}

exports.postProdutos = (req, res, next) => {
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ errror: error}) }
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release();
        if (error) { return res.status(500).send({ errror: error}) }
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });
}

exports.getUmProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ errror: error}) }
                
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID'
                    })
                }
                const response = {
                    produtoCriado: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
}

exports.patchProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ errror: error}) }
        conn.query(
            `UPDATE    produtos
            SET        nome   =  ?,
                       preco  =  ?
            WHERE id_produto  =  ?`,
            [
                req.body.nome,
                req.body.preco,
                req.body.id_produto
            ],
            (error, result, field) => {
                conn.release();
        if (error) { return res.status(500).send({ errror: error}) }
               const response = {
                mensagem: 'Produto alterado com sucesso',
                produtoActualizado: {
                    id_produto: req.body.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna os detalhes de um produto especifico',
                    url: 'http://localhost:3000/produtos/' + req.body.id_produto
                }
            }
        }
        return res.status(202).send(response);
            }
        )
    });
}

exports.deleteProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ errror: error}) }
        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?', [req.body.id_produto],
            (error, resultado, field) => {
                conn.release();
        if (error) { return res.status(500).send({ errror: error}) }
        const response = {
            mensagem: 'Produto removido com sucesso',
            request: {
                tipo: 'POST',
                descricao: 'Insere um produto',
                url: 'http://localhost:3000/produtos/',
                body: {
                    nome: 'String',
                    preco: 'Number'
                }
            }
        }
               return res.status(202).send(response);
            }
        )
    });
}