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
