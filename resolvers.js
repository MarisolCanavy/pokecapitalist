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
  var tempsEcoule = Date.now() - context.lastupdate;
  
  const products = context.products.map((product) => {
    if(product.managerUnlocked = "false"){
      if(product.timeleft != 0 | product.timeleft < context.lastupdate){
        context.score = product.quantite*product.cout
      }else{
        product.timeleft = tempsEcoule;
      }
    }
    else if (product.managerUnlocked = "true"){
      context.score += floor(tempsEcoule / product.vitesse)*product.cout;
      product.timeleft = produit.vitesse - (floor(tempsEcoule / product.vitesse))*produit.vitesse;
    }
    return product;
  });
}

module.exports = {
  Query: {
    getWorld(parent, args, context) {
      saveWorld(context);
      return context.world;
    }
  },
  Mutation: {
    acheterQtProduit(parent, {id, quantite}, {world}) {
      let productFind = null;

      const products = world.products.map((product) => {
        if (product.id == id){
          if(world.money - (product.cout * quantite) > 0){
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
          product.timeleft += product.vitesse;
          productFind = product;
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
