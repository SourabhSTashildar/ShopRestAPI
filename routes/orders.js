var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Order = require('../models/orders');

/* GET orders listing. */
router.get('/', function (req, res, next) {
    Order.find()
        .exec()
        .then(function (doc) {
            var response = {
                count:doc.length,
                orders:doc.map(function(record){
                    return {
                        product: record.product,
                        quantity: record.quantity,
                        request:{
                            type:'GET',
                            url:'http://localhost:3000/orders/'+record._id
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

/* GET orders by id. */
router.get('/:orderId', function (req, res, next) {
    orderId = req.params.orderId;
    Order.findById(orderId)
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

/* POST order. */
router.post('/', function (req, res, next) {
    var order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
    });
    order.save()
        .then(function (result) {
            res.status(201).json(result);
        })
        .catch(function (err) {
            res.status(500).json({ message: err });
        });
});

/* PATCH order. */
router.patch('/:orderId', function (req, res, next) {
    orderId = req.params.orderId;
    res.status(200).json({
        message: 'patch /orders/',
        id: orderId,
    });
});

/* DELETE order. */
router.delete('/:orderId', function (req, res, next) {
    orderId = req.params.orderId;
    res.status(200).json({
        message: 'delete /orders/',
        id: orderId,
    });
});

module.exports = router;
