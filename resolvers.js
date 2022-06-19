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

//porblème ici car la conversion 32 vers 64 bits ne se fait pas bien
function majScore(context) {
  if(context.world){
    let tempsEcoule = Date.now() - parseInt(context.world.lastupdate);

    context.world.products.map((product) => {
      // option 1 : le produit n'a pas de manager débloquer
      if(product.managerUnlocked == false){
        //regarde si le produit est en production
        if(product.timeleft !== 0){
          //si le produit a été produit, on rajoute au monde son gain
          if(product.timeleft > tempsEcoule){
            //plus tard il faudra rajouter le bonus des anges
            context.world.score += product.revenu;
          }else {
            {console.log(tempsEcoule)}
            product.timeleft = product.timeleft - tempsEcoule;
          }
        }
      // option 2 : le produit a le manager débloquer
      } else if (product.managerUnlocked == true){
        context.world.score += Math.floor(tempsEcoule / product.vitesse)*product.revenu;
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
      {console.log(context.world.money)}
      {console.log(context.user)}
      saveWorld(context);
      majScore(context);
      return context.world;
    }
  },
  Mutation: {
    acheterQtProduit(parent, args, {world}) {
      let productFind = null;

      const products = world.products.map((product) => {
        if (product.id == args.id){
          let somme = product.cout*((1-Math.pow(product.croissance, product.quantite+args.quantite))/(1-product.croissance))-product.cout*((1-Math.pow(product.croissance, product.quantite))/(1-product.croissance))
          
          if(world.money - somme >= 0){
            if(parseInt(world.lastupdate)-product.timeleft>0){
              majScore(world);
            }

            world.money -= somme;
            product.quantite += args.quantite;
            productFind = product;
            world.lastupdate = Date.now().toString()
          }else{
            console.error(err);
            throw new Error( `Le monde n'a pas assez d'argent ${context.money} pour acheter le produit ${args.quantite} x ${args.cout}.`)
          }
        }
        return productFind;
      })

      if (productFind == null) {
        console.error(err);
        throw new Error( `Le produit avec l'id ${args.id} n'existe pas`)
      }

      saveWorld(world);
      return productFind;    
    },
    lancerProductionProduit(parent, args, context){
      let productFind = null;

      console.log("read args of lancerProductionProduit " + args.id);
      console.log("read world of lancerProductionProduit " + context.world.products);

      context.world.products.map((product) => {
        if (product.id == args.id){
            product.timeleft = product.vitesse;
            productFind = product;
            majScore(context.world);

            context.world.lastupdate = Date.now().toString()          }
        return productFind;
      })

      if (productFind == null) {
        console.error(err);
        throw new Error( `Le produit avec l'id ${args.id} n'existe pas`)
      }
      console.log("found of lancerProductionProduit " + productFind.name);

      saveWorld(context.world);
      return productFind;  
    },
    engagerManager(parent, {name}, {world}){
      let managerFind = null;
      let idManagee = null;
      let produitManage = null;

      const managers = world.managers.map((manager) => {
        if (managers.name == name){
          idManagee = manager.idcible;
          managerFind = manager;
          manager.unlocked = true;

          const produits = world.products.map((product) => {
            if (product.id == idManagee){
              produitManage = product;
              product.managerUnlocked = true;
            }
            return product;
          })
        }
        return managerFind;
      })

      if (managerFind == null) {
        console.error(err);
        throw new Error( `Le manager avec le nom ${args.name} n'existe pas.`)
      }

      if (produitManage == null) {
        console.error(err);
        throw new Error( `Le produit dont le manager est ${args.name} n'existe pas.`)
      }

      saveWorld(world);
      return productFind; 
    }
  },
};
