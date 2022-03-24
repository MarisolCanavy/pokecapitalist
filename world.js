module.exports = {
    "name": "PokeWorld",
    "logo": "ressources/logomonde.jpg",
    "money": 0,
    "score": 0,
    "totalangels": 0,
    "activeangels": 0,
    "angelbonus": 2,
    "lastupdate": 0,
    "products": [
        {
            "id": 1,
            "name": "premier produit",
            "logo": "icones/premierproduit.jpg",
            "cout": 4,
            "croissance": 1.07,
            "revenu": 1,
            "vitesse": 500,
            "quantite": 1,
            "timeleft": 0,
            "managerUnlocked": false,
            "palliers": [
                {
                    "name": "Nom du premier palier",
                    "logo": "ressources/pokemons/teamBulbi/bulbasaur.png",
                    "seuil": 20,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": "false"
                },
                {
                    "name": "Nom deuxième palier",
                    "logo": "icones/deuxiemepalier.jpg",
                    "seuil": 75,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": "false"
                },
 …
            },
            {
                "id": 2,
                "name": "Deuxième produit »,
 "logo": "icones/deuxiemeproduit.jpg",
            } …
        ],
        "allunlocks": [
            {
                "name": "Nom du premier unlock général",
                "logo": "icones/premierunlock.jpg",
                "seuil": 30,
                "idcible": 0,
                "ratio": 2,
                "typeratio": "gain",
                "unlocked": "false"
            },
 …
        ],
        "upgrades": [
            {
                "name": "Nom du premier upgrade",
                "logo": "icones/premierupgrade.jpg",
                "seuil": 1e3,
                "idcible": 1,
                "ratio": 3,
                "typeratio": "gain",
                "unlocked": "false"
            },
 …
        ],
        "angelupgrades": [
            {
                "name": "Angel Sacrifice",
                "logo": "icones/angel.png",
                "seuil": 10,
                "idcible": 0,
                "ratio": 3,
                "typeratio": "gain",
                "unlocked": "false"
            },
 …
        ],
        "managers": [
            {
                "name": "Wangari Maathai",
                "logo": "icones/WangariMaathai.jpg",
                "seuil": 10,
                "idcible": 1,
                "ratio": 0,
                "typeratio": "gain",
                "unlocked": "false"
            },
 …
        ]
    };