const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const ProdutosController = require('../controllers/produtos-controller');

router.get('/', login.obrigatorio, ProdutosController.getProdutos);
router.post('/', login.obrigatorio, ProdutosController.postProdutos);
router.get('/:id_produto', login.obrigatorio, ProdutosController.getUmProduto);
router.patch('/', login.obrigatorio, ProdutosController.patchProduto);
router.delete('/', login.obrigatorio, ProdutosController.deleteProduto);

module.exports = router;