var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Product = require('../models/products');

/* GET products listing. */
router.get('/', function (req, res, next) {
    Product.find()
        .exec()
        .then(function (doc) {
            var response = {
                count:doc.length,
                products:doc.map(function(record){
                    return {
                        name: record.name,
                        price: record.price,
                        category: record.category,
                        request:{
                            type:'GET',
                            url:'http://localhost:3000/products/'+record._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(function (err) {
            res.status(500).json({ message: err });
        });
});

/* GET products by id. */
router.get('/:productId', function (req, res, next) {
    productId = req.params.productId;
    Product.findById(productId)
        .exec()
        .then(function (doc) {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'no matching items found' });
            }

        })
        .catch(function (err) {
            res.status(500).json({ message: err });
        });

});

/* POST product. */
router.post('/', function (req, res, next) {
    var product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
    });
    product.save()
        .then(function (result) {
            res.status(201).json(result);
        })
        .catch(function (err) {
            res.status(500).json({ message: err });
        });
});

/* PATCH product. */
router.patch('/:productId', function (req, res, next) {
    productId = req.params.productId;
    var updateData = {};
    Object.keys(req.body).forEach(function (key) {
        updateData[key] = req.body[key];
    });
    Product.updateOne({_id:productId},{$set:updateData})
        .exec()
        .then(function(result){
            res.status(200).json(result);
        })
        .catch(function (err) {
            res.status(500).json({ message: err });
        });
});

/* DELETE product. */
router.delete('/:productId', function (req, res, next) {
    productId = req.params.productId;
    Product.remove({ _id: productId })
        .exec()
        .then(function (result) {
            res.status(200).json(result);
        })
        .catch(function (err) {
            res.status(500).json({ message: err });
        });
});

module.exports = router;
