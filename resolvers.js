function saveWorld(context) {
  var fs = require('fs');
  fs.writeFile(
    "userworlds/" + context.user + "-world.json",
    JSON.stringify(context.world),
    (err) => {
      if (err) {
        console.error(err);
        throw new Error(`Erreur d'écriture du monde coté serveur`);
      }
    }
  );
}

function majScore(context) {
  if(context.world){
    let tempsEcoule = Date.now() - parseInt(context.world.lastupdate);

    context.world.products.map((product) => {
      // option 1 : le produit n'a pas de manager débloquer
      if(product.managerUnlocked === false){
        //regarde si le produit est en production
        if(product.timeleft !== 0){
          //si le produit a été produit, on rajoute au monde son gain
          if(product.timeleft < tempsEcoule){
            //plus tard il faudra rajouter le bonus des anges
            context.world.score += product.revenu;
            context.world.money += product.revenu;
            product.timeleft = 0;
          }else {
            product.timeleft = product.timeleft - tempsEcoule;
          }
        }
      // option 2 : le produit a le manager débloquer
      } else if (product.managerUnlocked === true){
        {console.log("MajScore : " + product.name + " a son manager débloqué")}
        context.world.score += Math.floor(tempsEcoule / product.vitesse)*product.revenu;
        context.world.money += Math.floor(tempsEcoule / product.vitesse)*product.revenu;
        product.timeleft = parseInt(product.vitesse - (Math.floor(parseInt(tempsEcoule) / product.vitesse))*product.vitesse);
      }
    });
    // mise à jour du lastupdate
    context.world.lastupdate = Date.now().toString()
  }
}

module.exports = {
  Query: {
    getWorld(parent, args, context) {
      majScore(context);
      saveWorld(context);
      return context.world;
    }
  },
  Mutation: {
    acheterQtProduit(parent, args, context) {
      majScore(context);
      let productFind = context.world.products.find(p =>  p.id === args.id)
      if(productFind){
        let somme = productFind.cout*((1-Math.pow(productFind.croissance, productFind.quantite+args.quantite))/(1-productFind.croissance))-productFind.cout*((1-Math.pow(productFind.croissance, productFind.quantite))/(1-productFind.croissance))
          
        if(context.world.money - somme >= 0){
          if(parseInt(context.world.lastupdate)-productFind.timeleft>0){
            majScore(context);
          }
          context.world.money -= somme;
          productFind.quantite += args.quantite;
          context.world.lastupdate = Date.now().toString()

          //regarder si on a atteint le pallier
          let nextPalier = productFind.paliers.find( p => p.unlocked === false)
          if(nextPalier){
            if(productFind.quantite >= nextPalier?.seuil){
              nextPalier.unlocked = true
            }
          }   
      }else{
            console.error(err);
            throw new Error( `Le monde n'a pas assez d'argent ${context.money} pour acheter le produit ${args.quantite} x ${args.cout}.`)
          }
      }else{
        console.error(err);
        throw new Error( `Le produit avec l'id ${args.id} n'existe pas`)
      }
      saveWorld(context);
      majScore(context);
      return productFind;    
    },
    lancerProductionProduit(parent, args, context){
      majScore(context);

      let productFind = context.world.products.find(p =>  p.id === args.id)
      if(productFind){
        productFind.timeleft = productFind.vitesse
        context.world.lastupdate = Date.now().toString()  
      }else{
        console.error(err);
        throw new Error( `Le produit avec l'id ${args.id} n'existe pas`)
      }
      console.error(productFind.name + " a été lancé produit " + productFind.revenu);
      saveWorld(context);
      majScore(context);
      return productFind;  
    },
    engagerManager(parent, args, context){
      majScore(context)      
      let managerFind = context.world.managers.find(m =>  m.name === args.name)
    
      if(managerFind){
        {console.log(" managerFind found : " + managerFind.name + " manager " + managerFind.unlocked)}
        managerFind.unlocked = true
        context.world.products.map((product)=> {console.log(product.id)})
        let produitManage = context.world.products.find(p =>  p.id === managerFind.idcible )
        if(produitManage){
          produitManage.managerUnlocked = true
        }else{
          console.error(err);
          throw new Error( `Le produit dont le manager est ${args.name} n'existe pas.`)
        }  
      }else{
        console.error(err);
        throw new Error( `Le manager avec le nom ${args.name} n'existe pas.`)
      }

      saveWorld(context);
      majScore(context);
      return managerFind; 
    }
  },
};
