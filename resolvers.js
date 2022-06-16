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

//porblème ici carc la conversion 32 vers 64 bits ne se fait pas bien
function majScore(context) {
  var tempsEcoule = Date.now().toString() - context.world.lastupdate;
  
  const products = context.world.products.map((product) => {
    if(product.managerUnlocked = "false"){
      if(product.timeleft !== 0 | product.timeleft < parseInt(context.world.lastupdate)){
        context.world.score += product.quantite*product.revenu;
      }else{
        product.timeleft = tempsEcoule;
        console.log(tempsEcoule);
      }
    }
    else if (product.managerUnlocked = "true"){
      context.world.score += floor(tempsEcoule / product.vitesse)*product.revenu;
      product.timeleft = parseInt(product.vitesse - (floor(parseInt(tempsEcoule) / product.vitesse))*product.vitesse);
    }
    return product;
  });
}

module.exports = {
  Query: {
    getWorld(parent, args, context) {
      saveWorld(context);
      //majScore(context);
      return context.world;
    }
  },
  Mutation: {
    acheterQtProduit(parent, {id, quantite}, {world}) {
      let productFind = null;

      const products = world.products.map((product) => {
        if (product.id == id){
          let somme = product.cout((1-Math.pow(product.croissance, quantite))/(1-product.croissance));

          if(world.money - somme > 0){
            if(world.lastupdate-product.timeleft>0){
              miseAjour(world);
            }
            world.money -= product.cout * quantite;

            product.quantite += product.quantite;
            productFind = product;
            product.timeleft = product.vitesse;
            world.lastupdate = Date.now();
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
    lancerProductionProduit(parent, {id}, {world}){
      let productFind = null;

      const products = world.products.map((product) => {
        if (product.id == id){
            if(world.lastupdate-product.timeleft>0){
              product.timeleft = product.vitesse;
              productFind = product;
              miseAjour(world);
            }

            world.lastupdate = Date.now().toString;
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
    engagerManager(parent, {name}, {world}){
      let managerFind = null;
      let idManagee = null;
      let produitManage = null;

      const managers = world.managers.map((manager) => {
        if (managers.id == id){
          idManagee = manager.idcible;
          managerFind = manager;
          manager.unlocked = "true";

          const produits = world.products.map((product) => {
            if (product.id == id){
              produitManage = product;
              product.managerUnlocked = "true";
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
      saveWorld(world);
      return productFind; 
    }
  },
};
