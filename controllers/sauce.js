const Sauce = require('../models/sauce');
const fs = require('fs');// files sistem

//logique

//création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);// pour transformer l'objet JSON en JS
    const sauce = new Sauce({// creation d'une nouvelle instance du model thing
        ...sauceObject,
        // http://localhost:3000/image/nomdufichier 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()// pour enregistrer l'objet thing dans la base de donne
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));

        sauceObject.likes = 0;  // à l'objet sauce on ajoute like à 0
        sauceObject.dislikes = 0; // à l'objet sauce on ajoute dislike
        sauceObject.usersLiked = Array(); // déclaration tableau des utilisateur qui aiment
        sauceObject.usersDisliked = Array(); // déclaration tableau des utilisateur qui aiment pas
};

// modif sauce existante
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    //si image
    { 
        ...JSON.parse(req.body.sauce),// on recupere la chaine de caracter on la transforme en objet JS
        // et on modifie url
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // si il y en a pas
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })// premier argument est celui qu'on veut modifier, le deuxieme c'est la nouvelle version de l'objet 
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch(error => res.status(400).json({ error }));
};

// supp sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})// on cherche url image
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];// on recupere le nom precis du fichier ( 2eme element, apres /image/)
            fs.unlink(`images/${filename}`, () => {// unlink : pour effacer un fichier
                // On supprime l'objet de la base de donné
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));// erreur du server
};

// Récup 1 sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//récup toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()// nous permet de lire dans la base de donne les differentes sauces
    .then(sauces => res.status(200).json(sauces))// récupération du tableau des sauces
    .catch(error => res.status(400).json({ error }));
};

//like ou dislike ? Tel est la question ....
exports.likeOrDislike = (req, res, next) => {
    //si l'utilisateur aime la sauce
    if (req.body.like === 1) {
        //Ajoue 1 et le "push" vers tableau usersLiked
        Sauce.updateOne({_id: req.params.id}, {$inc: {likes: req.body.like++}, $push: { usersLiked: req.body.userId}})
            .then((sauce) => res.status(200).json({ message: 'Merci pour le like !'}))
            .catch (error => res.status(400).json({error})) 
    // si utilisateur aime pas la sauce
    } else if (req.body.like === -1) {
        // Retire 1 et le "push" vers tableau usersDisliked
        Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: (req.body.like++) * -1}, $push: {usersdisliked: req.body.userId} })
            .then((sauce) => res.status(200).json({ message: 'Jaime pas les dislikes'}))
            .catch(error => res.status(400).json({error}))
    }
    
};