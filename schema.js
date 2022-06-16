const { gql } = require("apollo-server-express");
module.exports = gql`

  enum RatioType {
    gain
    vitesse
    ange
  }



  type Product {
    id: Int!
    name: String
    logo: String
    cout: Float
    croissance: Float
    revenu: Float
    vitesse: Int
    quantite: Int
    timeleft: Int
    managerUnlocked: Boolean
    paliers: [Palier]
  }

  type Palier {
    name: String!
    logo: String
    seuil: Float
    idcible: Int
    ratio: Int
    typeratio: RatioType
    unlocked: Boolean
  }
  
  type World {
    name: String!
    logo: String
    money: Float
    score: Float
    totalangels: Int
    activeangels: Int
    angelbonus: Int
    lastupdate: String
    products: [Product]
    allunlocks: [Palier]
    upgrades: [Palier]
    angelupgrades: [Palier]
    managers: [Palier]
  }

  type Query {
    getWorld: World
  }

  type Mutation {
    acheterQtProduit(id: Int!, quantite: Int!): Product
    lancerProductionProduit(id: Int!): Product
    engagerManager(name: String!): Palier
    acheterCashUpgrade(name: String!): Palier
    acheterAngelUpgrade(name: String!): Palier
    resetWorld: World
  }
  
`;
