'use strict';

var express = require('express'),
		router = express.Router(),
    Vote = require('../models/vote');

function getAll(req, res, next){
	Vote.find().select('-_id quantidade numero tipo').exec(function(err, data){
 		res.send({ error: false, data: data });
  });
};

router.get('/', function(req, res, next) {
	getAll(req, res, next);
});

router.get('/dados', function(req, res, next){
	res.send({
		podeVotar: false,
		data: {
			vereadores: [{
		    nome: 'AAAA',
		    partido: 'BBBB',
		    numero: '123456',
		    quantidade: 0
	  	}],
			prefeitos: [{
		    nome: 'Osvaldo Jurk e Adriano Kath',
		    partido: 'DDD',
		    numero: '45',
		    quantidade: 0
		  }, {
		    nome: 'Felipe Voigt e Fulano',
		    partido: 'DDD',
		    numero: '16',
		    quantidade: 0
		  }, {
		    nome: 'Jair Bridaroli e Fulano',
		    partido: 'DDD',
		    numero: '15',
		    quantidade: 0
		  }]
		}
	});
});

router.post('/', function(req, res, next) {
 	Vote.findOne({
 		numero: req.body.numero,
 		tipo: req.body.tipo
 	}).exec(function(err, data){
 		if(data === null){
 			var vote = new Vote();
			vote.numero = req.body.numero;
			vote.tipo = req.body.tipo;
		  vote.quantidade = 1;
		  vote.save(function(err, data) {
		  	getAll(req, res, next);
			});
 		}else{
		  data.quantidade = parseInt(data.quantidade) + 1;
		  data.save(function(err, data) {
		  	getAll(req, res, next);
			});
 		}
  });
});

module.exports = router;