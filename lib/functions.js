console.log('- functions.js loaded'.yellow);

var crypto = require('crypto');
var db = require('./db');
var dataAccess = require('./dataAccess');

module.exports = {

	firstLetterToUpper: function(str){
	    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	},

	checkUserPass: function (profList, username, password, sess, callback){
		var logged = 0;
        for(var k in profList){
			if (username==profList[k].IDENTIFIANT_PROFESSEUR){
				if (crypto.createHash('md5').update(password).digest("hex")==profList[k].PASSWORD_PROFESSEUR)
				{
					logged++;
					sess.id_professeur = profList[k].ID_PROFESSEUR;
					sess.nom = profList[k].NOM_PROFESSEUR.toUpperCase();
					sess.prenom = this.firstLetterToUpper(profList[k].PRENOM_PROFESSEUR);
					sess.identifiant = profList[k].IDENTIFIANT_PROFESSEUR;
					// console.log(sess.identifiant + " is connected -> creating session".grey);
				}
			}
		}
		callback(logged);
    },

	/** Middleware for security (each user can only see his questions */
	checkIdQuestion: function(req, res, next){
		var queryString = 'SELECT * FROM QUESTION q LEFT JOIN QUESTIONNAIRE qu ON qu.ID_QUESTIONNAIRE = q.ID_QUESTIONNAIRE WHERE qu.ID_PROFESSEUR=? AND q.ID_QUESTION=?' ;
		db.query(queryString, [req.session.id_professeur, req.params.id], function(err,rows){
			if(rows != null && rows.length!=0){
				next();
			} else {
				res.redirect("../rip");
			}
		});
	},

	/** Middleware for security (each user can only see his questionnary */
	checkIdQuestionnaire: function(req, res, next){
		var queryString = 'SELECT * FROM QUESTIONNAIRE WHERE ID_PROFESSEUR=? AND ID_QUESTIONNAIRE=?';
		db.query(queryString, [req.session.id_professeur, req.params.id], function(err,rows){
			if(rows != null && rows.length!=0){
				next();
			} else {
				res.redirect("../rip");
			}
		});
	},

	/** Middleware for limited access and admin interface */
	requireLogin: function(req, res, next) {
		sess=req.session;
		if (sess.id_professeur) {
			next();
		} else {
			res.redirect("/");
		}
	},

	/** Middleware check session exist */
	notLogged: function(req, res, next){
		var sess = req.session;
		if(sess.id_professeur != null){
			res.redirect('/admin');
		} else {
			next();
		}
	},

	checkRegister: function(name, firstname, login, password1, password2, callback){
		var userData = new Array(name, firstname, login, password1, password2);
    	dataAccess.findByFieldHasValue('PROFESSEUR', 'IDENTIFIANT_PROFESSEUR', login, function(res){
    		if (res.length == 0){ // AUCUNE LIGNE RENVOYEE, aucun professeur n'existe pour cet identifiant
				if (name != null && name.length >= 1 && name.length <= 100) {
					if(firstname != null && firstname.length >= 1 && firstname.length <= 100) {
						if(login != null && login.length >= 3 && login.length <= 100) {
							if(password1 != null && password2 != null && password1.length <= 100 &&  password1.length >= 6 && password1 == password2) {
								password1 = crypto.createHash('md5').update(password1).digest("hex");
								dataAccess.addProff(name, firstname, login, password1, function(result){
									callback(0);
								});
							} else callback(2); // PASSWORD BETWEEN 6 AND 100 CHAR
						} else callback(3); // IDENTIFIANT BETWEEN 3 AND 100 CHAR
					} else callback(4); // PRENOM BETWEEN 1 and 100 CHAR
				} else callback(5); // NOM BETWEEN 1 and 100 CHAR
			} else callback(1); // identifiant already exist
    	});
	},

  requireLogin: function(req, res, next) {
    sess=req.session;
    if (sess.id_professeur) {
      next();
    } else {
      res.redirect("/");
    }
  },

  notLogged: function(req, res, next){
    var sess = req.session;
    if(sess.id_professeur != null){
      res.redirect('/admin');
    } else {
      next();
    }
  },

}
