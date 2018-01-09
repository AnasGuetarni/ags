// router.js

console.log('- router.js loaded'.yellow);

var fs = require('fs');
var functions = require('./functions');
var dataAccess = require('./dataAccess');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

module.exports = function(app){

	app.get('/', [functions.notLogged], function(req, res, next) {
		var erreur = false;
		if (req.query.failed) erreur = true;
	  	res.render('../view/login.ejs', {
	  		title: 'Amphiquizz - Connexion',
	  		erreur: erreur,
	  		newAcc: req.query.newAcc
	  	});
	});

	app.post('/login', function(req, res){
		var sess = req.session;
		dataAccess.findAll('PROFESSEUR', function(profList){
			functions.checkUserPass(profList, req.body.login, req.body.mdp, sess, function(logged){
				if (logged>=1) res.redirect('/admin');
				else res.redirect('/?failed=true');
			});
		});
	});

	app.post('/register', function(req, res){
		functions.checkRegister(req.body.name, req.body.firstname, req.body.login, req.body.password1, req.body.password2, function(errCode){
			console.log(errCode)
			if (errCode==0){
				res.redirect('/');
			} else {
				res.redirect('/register?failed=' + errCode);
			}
		});
	});

	app.get('/logout',function(req,res){
		global.appelEnCours = false;
		global.currentQuestion = false;
		global.session = false;
		req.session.destroy(function() {
			res.redirect("/");
		});
	});

	app.get('/admin', [functions.requireLogin], function(req, res){
		dataAccess.findQuestionnaireByIdProf(sess.id_professeur, function(data){
  			res.render('../view/admin.ejs', {
  				title: 'Amphiquizz - Mes questionnaires',
  				h_title: 'Mes questionnaires',
  				lastname: sess.nom,
  				firstname: sess.prenom,
  				data: data
  			});
	    });
	});

	app.get('/register', function(req, res){
		res.render('../view/register.ejs', {
				title: 'ZoneB - Créer un compte',
	  			data: req.query.failed
  		});
	});

	app.use(function(req, res){
		res.render('../view/404error.ejs', { title: 'Amphiquizz - Impossible de trouver la page demandée' });
	});

}
