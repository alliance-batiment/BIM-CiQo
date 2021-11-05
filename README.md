## Créer mon application openBIM

> Afin de permettre aux ingénieurs de pouvoir développer leurs propres applications openBIM en ligne, <a href="https://www.tridyme.com/fr/" target="_blank">TriDyme</a> met à disposition le kit de développement <a href="https://github.com/tridyme/sdk-bim-viewer" target="_blank">sdk-bim-viewer</a>.

> Ce projet vous permet de créer et de publier vos propres applications de ligne et de les proposer dans la marketplace de <a href="https://www.tridyme.com/fr/" target="_blank">TriDyme</a> gratuitement.

## Sommaire (Optional)

- [Installations](#installations)
- [Créer notre première application](#create-my-own-app)
- [Déployer son code sur GitHub](#github)
- [Mettre son application en ligne](#online-webapp)
- [License](#license)

## <a name="installations"></a>Installations

Les prérequis suivants doivent être installé:
- Un environnement d'exécution JavaScript: [Node.js](#nodejs), téléchargeable <a href="https://nodejs.org/fr/download/" target="_blank">**ici**</a> 
- Un logiciel de gestion de versions: [Git](#git), téléchargeable <a href="https://git-scm.com/downloads" target="_blank">**ici**</a> 
- Un éditeur de code cross-platform: [VSCode](#vscode), téléchargeable <a href="https://code.visualstudio.com/Download" target="_blank">**ici**</a> 

### <a name="nodejs"></a>Node.js

Ce kit de développement est écrit en <a href="https://fr.reactjs.org/" target="_blank">**React.js**</a> qui lui même nécessite <a href="https://nodejs.org/fr/" target="_blank">**Node.js**</a>. **Node.js** est un environnement d'exécution JavaScript installable partout, qui permet d'écrire n'importe quel type de programme en JavaScript : outil en ligne de commande, serveur, application desktop, internet des objets (IoT).

Pour installer Node.js, allez sur <a href="https://nodejs.org/fr/download/" target="_blank">**https://nodejs.org/fr/download/**</a> puis suivez les instructions.

Afin de vérifier que Node.js a été bien installé, vous pouvez utiliser **Invite de Commandes** (cmd.exe sur Windows), et tapez la commande `node -v` afin de vérifier que vous n'avez pas de message d'erreur et que la version de Node est supérieur à la version 6.

```shell
$ node -v
v10.3.0
```

**Node.js** est installé avec **npm** est le gestionnaire de modules de Node. Afin de vérifier que **npm** est bien installé et que la version de Node est supérieur à la version 5, tapez la commande `npm -v` :

```shell
$ npm -v
6.9.0
```

### <a name="git"></a>Git

<a href="https://git-scm.com/">**Git**</a> est un logiciel de gestion de versions, il permet de versionner, d'enregistrer et de rendre open-source du code. Pour l'installer: <a href="https://git-scm.com/downloads" target="_blank">**https://git-scm.com/downloads**</a>.

De même, pour vérifier que l'installation c'est bien déroulé, taper la commande `git version`:
```shell
$ git version
```

### <a name="vscode"></a>VSCode (recommandé)

Afin de pouvoir développer son application, le plus simple est d'utiliser <a href="https://code.visualstudio.com">**VSCode**</a> qui est un éditeur de code cross-platform, open-source et gratuit supportant une dizaine de langages.

Pour l'installer: <a href="https://code.visualstudio.com/Download" target="_blank">**https://code.visualstudio.com/Download**</a>.

## <a name="create-my-own-app"></a>Créer notre première application

### Cloner le kit de développement

Afin de créer notre première application, commençons par cloner le <a href="https://github.com/tridyme/sdk-bim-viewer" target="_blank">sdk-bim-viewer</a> grâce à **git** dans le repertoire ou nous souhaitons :
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


## <a name="online-webapp"></a>Mettre son application en ligne avec Netlify

Afin de mettre son application en ligne, nous allons utiliser <a href="https://www.netlify.com/" target="_blank">**Netlify**</a> qui permet de dépoyer des applications de manière gratuite.

Pour cela, il faut au préalable créer un compte gratuitement sur <a href="https://www.netlify.com/" target="_blank">Netlify</a> et <a href="https://github.com/" target="_blank">Github</a>.




## <a name="assistance"></a>Communauté & Assistance

Afin de pouvoir échanger sur le sujet et répondre à vos questions, vous pouvez rejoindre notre serveur Discord:
https://discord.gg/zgHGa2Tpe4

Vous pouvez également nous contacter par email: <a href="contact@tridyme.com" target="_blank">contact@tridyme.com</a>.

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2021 © <a href="http://tridyme.com" target="_blank">TriDyme</a>.