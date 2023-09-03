const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const { validateProduct, Product } = require('../models/product');

const router = express.Router();

router.use(authentication);

router.get('/', authorization.grantAccess("readAny", "product"), async (req, res) => {
    const products = await Product.find({});

    return res.status(200).send(products);
});

router.get('/:id', authorization.grantAccess("readAny", "product"), async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {

        return res.status(404).send({ message: 'Product not founded' });
    }

    return res.status(200).send(product);
});

router.post('/', authorization.grantAccess("createAny", "product"), async (req, res) => {
    const { value, error } = validateProduct(req.body);

    if (error) {
        return res.status(400).send({ message: error.message });
    }

    const product = await Product.create({
        ..._.pick(value, ['title', 'description', 'colors']),
    });

    return res.status(201).send(product);
});

router.put('/:id', authorization.grantAccess("updateAny", "product"), async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).send({ message: 'Invalid ID' });
    }

    const product = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if (!product) {
        return res.status(404).send({ message: 'Product not founded' });
    }



    return res.status(200).send({ message: 'product updated successfully', product });
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).send({ message: 'Invalid ID' });
    }

    const product = await Product.findById(id);

    if (!product) {
        return res.status(404).send({ message: 'Product not founded' });
    }

    if (product.user.toString() !== req.user.id) {
        return res
            .status(403)
            .send({ message: 'You do not have permissions to this action.' });
    }

    await product.deleteOne();
    return res.sendStatus(200);
});

module.exports = router;
