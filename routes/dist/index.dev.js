"use strict";

var express = require('express');

var router = express.Router();
/* Database Mongodb */

var MongoClient = require('mongodb').MongoClient;

var assert = require('assert');

var objectID = require('mongodb').ObjectID; // Connection URL


var url = 'mongodb://localhost:27017'; // Database Name

var dbName = 'nurarihyon';
/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Telephone Directory'
  });
});
/* Add data */

router.post('/', function (req, res, next) {
  var data = {
    "name": req.body.name,
    "phone": req.body.phone
  };

  var insertDocuments = function insertDocuments(db, callback) {
    var collection = db.collection('user');
    collection.insert(data, function (err, result) {
      assert.equal(err, null);
      callback(result);
    });
  };

  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    var db = client.db(dbName);
    insertDocuments(db, function () {
      client.close();
    });
  });
  res.redirect('/');
});
/* GET view page. */

router.get('/manage-contact-information', function (req, res, next) {
  var findDocuments = function findDocuments(db, callback) {
    var collection = db.collection('user');
    collection.find({}).toArray(function (err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  };

  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    var db = client.db(dbName);
    findDocuments(db, function (data) {
      res.render('view', {
        title: 'Manage Contact Information',
        nura: data
      });
      client.close();
    });
  });
});
/* Remove data. */

router.get('/remove/:id', function (req, res, next) {
  var id = objectID(req.params.id);

  var removeDocument = function removeDocument(db, callback) {
    var collection = db.collection('user');
    collection.deleteOne({
      _id: id
    }, function (err, result) {
      assert.equal(err, null);
      callback(result);
    });
  };

  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    var db = client.db(dbName);
    removeDocument(db, function () {
      client.close();
      res.redirect('/manage-contact-information');
    });
  });
});
/* Edit data. */

router.get('/edit/:id', function (req, res, next) {
  var id = objectID(req.params.id);

  var findDocuments = function findDocuments(db, callback) {
    var collection = db.collection('user');
    collection.find({
      _id: id
    }).toArray(function (err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }; // Use connect method to connect to the server


  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    var db = client.db(dbName);
    findDocuments(db, function (data) {
      console.log(data);
      client.close();
    });
  });
});
module.exports = router;