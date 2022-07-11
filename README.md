![BIM-CiQo](./AllianceBatiment.jpeg "BIM-CiQo")

## Créer mon application openBIM à partir de BIM-CiQo

> Afin de permettre aux acteurs de la construction de pouvoir développer leurs propres applications openBIM en ligne et de pouvoir les enrichir avec de la donnée au format libre <a href="https://alliance-batiment.org/open-dthx-langage-ouvert-et-libre-dacces-pour-decrire-les-composants/" target="_blank">open dthX</a>, <a href="https://alliance-batiment.org/" target="_blank">Alliance du Batiment</a> met à disposition le kit de développement <a href="https://github.com/alliance-batiment/bim-ciqo" target="_blank">BIM-CiQo</a>.

> Il est basé sur cette excellente initiative open-source qu'est <a href="https://ifcjs.github.io/info/" target="_blank">IFC.js</a>.

>Démo live: 👉 <a href="https://alliance-batiment.ciqo.eu/" target="_blank">BIM-CiQo</a> 👈

## Sommaire

- [Mise en route](#installations)
- [Créer notre première application](#create-my-own-app)
- [Déployer son code sur GitHub](#github)
- [Mettre son application en ligne](#online-webapp)
- [License](#license)

## <a name="installations"></a>Mise en route

Pour plus d'informations concernant les prérequis en matière de languages de programmation et d'outils de développement nécessaire pour ce projet, vous pouvez consulter notre article:
<a href="https://www.tridyme.com/fr/blog/dev-application-web/" target="_blank">Créer sa propre Application Web</a>.


## <a name="create-my-own-app"></a>Créer notre popre application openBIM

### Cloner le kit de développement

Afin de créer notre propre application openBIM, commençons par cloner le <a href="https://github.com/alliance-batiment/bim-ciqo" target="_blank">BIM-CiQo</a> grâce à **git** dans le repertoire ou nous souhaitons :
```shell
$ git clone https://github.com/alliance-batiment/BIM-CiQo.git
```

### Démarrage

Une fois le clonage finalisé, vous pouvez renommer le dossier **BIM-CiQo** comme vous le souhaitez, ici nous l'appelerons **my-bim-app**:


Puis, entrez dans votre dossier, lancez l'installation des modules **Node.js** via la commande `npm install` et enfin démarrez l'application avec `npm start`:

```shell
$ cd ./my-bim-app
$ npm install
$ npm start
```
Notez que notre application a dû s'ouvrir automatiquement dans notre navigateur (si ce n'est pas le cas, ouvrez un nouvel onglet dans votre navigateur et saisissez l'URL indiquée par la commande dans le terminal, normalement  http://localhost:3000/ ).

Cette application permet de charger et de visualiser une maquette IFC.


## <a name="online-webapp"></a>Mettre son application en ligne

Afin de mettre son application en ligne, voir le tutoriel suivant:
<a href="https://www.tridyme.com/fr/blog/deploiement-avec-netlify">Deployer son Application Web en ligne gratuitement avec Netlify</a>


## <a name="assistance"></a>Communauté & Assistance

Afin de pouvoir échanger sur le sujet et répondre à vos questions, vous pouvez rejoindre notre serveur <a href="https://discord.gg/b9xy9zVpTB" target="_blank">Discord</a> et suivre nos développements sur notre <a href="https://github.com/alliance-batiment?tab=repositories" target="_blank">Github</a>.

Vous pouvez également nous contacter par email: <a href="contact@alliance-batiment.org" target="_blank">contact@alliance-batiment.org</a>.



A bientôt sur <a href="https://alliance-batiment.org/">Alliance du Batiment</a>!!

## License

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

- **[GNU license](https://www.gnu.org/licenses/gpl-3.0.html)**
- Copyright 2022 © <a href="https://alliance-batiment.org/" target="_blank">Alliance du Batiment</a>.