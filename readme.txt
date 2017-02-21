I - De chay tu dong code trong visual studio code

I.1. jsconfig.json

Create an empty jsconfig.json at the root of your project. You need this jsconfig.json file to get cross-file IntelliSense to work.

I.2. cai typings, can phai co file package.json truoc
npm install typings --save-dev

I.3.
npm install -g typings

I.4 Grabs the typings files from the Definitely Typed repository
This will create a typings.json file and a typings folder with the .d.ts files.
typings search angular
typings install dt~angular --save


II - de chay tu dong code css trong workspace(vi du bootstrap) trong visual studio code
cai extension html css class completion (tac gia Zignd)


III - Cai dat tsd DefinitelyTyped project definition files on github

1 -
npm install -g tsd

2 - create new tsd.json and typings/tsd.d.ts
tsd init

3 - search angular, "-action install" to download typings and place them in the folder specified in the path property in tsd.json, default is /typings, "-save" tells the tool to update the tsd.d.ts and tsd.json files
tsd query angular -action install -save



