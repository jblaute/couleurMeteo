

// lancement du serveur
var util = require('util');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

// ouverture base

var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose);
var db = mongoose.createConnection('mongodb://localhost:27017/test');

// creation des schemas

var schema = mongoose.Schema({ nom: 'string', prenom: 'string' });
var Utilisateur = db.model('Utilisateur', schema);
const strMois = ["Janvier","Février","Mars","Avril",
"Mai","Juin","Juillet","Aout","Septembre","Octobre",
"Novembre","Decembre"];

var schemaMeteo = mongoose.Schema({
	lieu: String,
	annee: Number,
	mois: Number,
	jour: Number,
	tmin: Float,
	tmax: Float,
	pluie: Float,
	soleil: Float,
	venmoyen: Float,
	ventmax: Float,
	ventdir: String, 
});
var Meteo = db.model('Meteo', schemaMeteo);
// requete
var requeteMeteo={};
// lancement du serveur

var server = app.listen(port, function() {
	console.log('Express server listening on port ' + port);
});

//objet de récupération des éléments d'une requète
var paramMeteo={
    lieu: new String(),
    annee: new Number(),
    mois : new Number()
  };
/*************************************************************************/
/***************************** test serveur ******************************/
/*************************************************************************/

/* app.get('/test', function (req, res) {
       var data2 = { "user1" : 
        { "nom" : "nono",  "password" : "password1"}};
	    res.send(data2); 
}); */

/* app.get('/enregistrer', function (req, res) {
	console.log('enregistre ');
	var c = new Utilisateur({ nom: 'l', prenom: 'jb' });
	c.save(function (err) {
	  if (err) {
		console.log("err save "+c.nom);
		res.send({res : false}); 
	  }
	  else {
		  console.log('saved : '+c.nom);
			res.send({res : true}); 
	  }
	});
}); */

// parametre dans url

/* app.get('/enregistrer2/:nom', function (req, res) {
	console.log('enregistre '+req.params.nom);
	var c = new Utilisateur({ nom: req.params.nom, prenom: 'ppp' });
	c.save(function (err) {
	  if (err) {
		//console.log("err save "+c.nom);
		res.send({res : false}); 
	  }
	  else {
		 // console.log('saved : '+c.nom);
			res.send({res : true}); 
	  }
	});
});

// parametre json

app.post('/enregistrer3', function (req, res) {
	console.log('enregistrer3 '+req.body.name);
	var c = new Utilisateur(req.body);
	c.save(function (err) {
	  if (err) {
		//console.log("err save "+c.nom);
		res.send({res : false}); 
	  }
	  else {
		  //console.log('saved : '+c.nom);
			res.send({res : true}); 
	  }
	});

}); */

/* app.get('/lister1', function (req, res) {
    
        Utilisateur.find({}, function(err, users) {
            //console.log('find '+users);
            var tab = [];
    
            users.forEach(function(user) {
                //userMap[user._id] = user;
                tab.push(user);
            });
            
            res.send(tab); 
        });
    }); */
    

/*************************************************************************/
/********************************* requetes ******************************/
/*************************************************************************/

/* app.post('/api/enregistrer', function (req, res) {
	console.log('api/enregistrer nom = '+req.body.nom);
	var c = new Utilisateur(req.body);
	c.save(function (err) {
	  if (err) {
		console.log("erreur api/enregistrer "+c.nom);
		res.send({res : false}); 
	  }
	  else {
		  console.log('api/enregistrer save : '+c.nom);
			res.send({res : true}); 
	  }
	});

}); */

/* app.get('/api/lister', function (req, res) {
	console.log('api/lister');
	
  Utilisateur.find({}, function(err, users) {
            //console.log('find '+users);
            var tab = [];
    
            users.forEach(function(user) {
                //userMap[user._id] = user;
                tab.push(user);
            });
            
            res.send(tab); 
  });
}); */
/* app.get('/api/listerMeteo',function(req,res){
	console.log('api/listerMeteo');
	Meteo.find({},function(err,datasMeteo){
		//console.log('find '+datasMeteo);
		var tabM = [];
		datasMeteo.forEach(function(dataMeteo){
			tabM.push(dataMeteo);	
		});
		res.send(tabM);
	});

});	 */

app.post('/api/requeteMeteoLieuMois',function(req,res){
	console.log('/api/requeteMeteoLieuMois');
	console.log("mois = "+req.body.mois);
	paramMeteo.lieu = req.body.lieu;
	paramMeteo.annee = req.body.annee;
	paramMeteo.mois = (strMois.indexOf(req.body.mois))+1;
	console.log("le num de mois" +paramMeteo.mois);
	res.send();
});


 app.get('/api/listerMeteoLieuMois',function listerLAM (req,res){
	console.log('api/listerMeteo');
	Meteo.find({"lieu":paramMeteo.lieu, "annee":paramMeteo.annee,"mois":paramMeteo.mois})
	.sort({"jour":1})
	.exec(function(err,datasMeteo){
		res.send(datasMeteo);
	});
}); 

app.get('/api/listerMeteoLAMDisponible',function(req,res){
	console.log("passage début fonction ");
	var dispo = {};
	dispo.lieu =[];
	dispo.annee =[];
	dispo.mois =[];
	
	Meteo.db.db.command({"distinct" : "meteos", "key": "lieu"},
		(function (err, dataMeteo){
			if (err) throw err;
		//console.log("lieu "+util.inspect(dataMeteo.body));
			dispo.lieu = dataMeteo.values;
			console.log("lieu "+dispo.lieu[0]);
			Meteo.db.db.command({"distinct" : "meteos", "key": "annee"},
				(function (err, dataMeteo){
					if (err) throw err;
					dispo.annee = dataMeteo.values;
					Meteo.db.db.command({"distinct" : "meteos", "key": "mois"},
						(function (err, dataMeteo){
							if (err) throw err;
							for (i=0;i<12;i++){
								dispo.mois[i] = strMois[dataMeteo.values[i]-1];
								console.log("mois = "+dispo.mois[i]);
							}	
							res.send(dispo);
						})
					)
				})			
			)
		})	
	)
});	

	
/* console.log('api/lister');

	Utilisateur.find({}, function(err, users) {
			console.log('find '+users);
			var tab = [];

			users.forEach(function(user) {
				//userMap[user._id] = user;
				tab.push(user);
			});
			
			res.send(tab); 
	});
}); */




//////////////////////////////////////////////////////////////////////////	
		
app.get('/api/supprimerUtilisateurs', function (req, res) {
	console.log('api/supprimerUtilisateurs');
	
	db.dropCollection('utilisateurs', function(err, result) {
		res.send("ok"); 
	});
});
		
