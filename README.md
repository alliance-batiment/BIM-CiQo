## Créer mon application openBIM

> Afin de permettre aux ingénieurs de pouvoir développer leurs propres applications openBIM en ligne, <a href="https://www.tridyme.com/fr/" target="_blank">TriDyme</a> met à disposition le kit de développement <a href="https://github.com/tridyme/sdk-bim-viewer" target="_blank">sdk-bim-viewer</a>.

> Ce projet vous permet de créer et de publier vos propres applications de ligne et de les proposer dans la marketplace de <a href="https://www.tridyme.com/fr/" target="_blank">TriDyme</a> gratuitement.

> Il est basé sur cette excellente initiative open-source qu'est <a href="https://ifcjs.github.io/info/" target="_blank">IFC.js</a>.

>Démo live: 👉 <a href="https://bimviewer.tridyme.com/" target="_blank">BIMViewer</a> 👈

## Sommaire (Optional)

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

Afin de créer notre propre application openBIM, commençons par cloner le <a href="https://github.com/tridyme/sdk-bim-viewer" target="_blank">sdk-bim-viewer</a> grâce à **git** dans le repertoire ou nous souhaitons :
```shell
$ git clone https://github.com/tridyme/sdk-bim-viewer.git
```

### Démarrage

Une fois le clonage finalisé, vous pouvez renommer le dossier **sdk-bim-viewer** comme vous le souhaitez, ici nous l'appelerons **my-bim-app**:


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

Si vous souhaitez la mettre en ligne de manière décentralisée avec le Web3.0:
<a href="https://www.tridyme.com/fr/blog/application-web3-decentralise">Deployer son Application Web décentralisée gratuitement avec Fleek</a>


## <a name="assistance"></a>Communauté & Assistance

Afin de pouvoir échanger sur le sujet et répondre à vos questions, vous pouvez rejoindre notre serveur <a href="https://discord.gg/zgHGa2Tpe4" target="_blank">Discord</a> et suivre nos développements sur notre <a href="https://github.com/tridyme?tab=repositories" target="_blank">Github</a>.

Vous pouvez également nous contacter par email: <a href="contact@tridyme.com" target="_blank">contact@tridyme.com</a>.



A bientôt sur <a href="http://app.tridyme.com">TriDyme</a>!!

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2021 © <a href="http://tridyme.com" target="_blank">TriDyme</a>.