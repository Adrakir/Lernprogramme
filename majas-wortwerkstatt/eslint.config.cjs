'use strict';
/* ESLint-Konfiguration für Majas Wortwerkstatt.
 * Die App nutzt klassische Skripte mit geteilten globalen Funktionen,
 * daher sind no-undef/no-unused-vars projektbedingt deaktiviert.
 * Ziel sind echte Fehlerklassen: doppelte Schlüssel, unerreichbarer Code usw. */
const js=require('@eslint/js');
module.exports=[
  {
    files:['*.js','e2e/*.cjs','*.test.cjs'],
    ignores:['diktat-audio.js','node_modules/**','playwright-report/**','test-results/**'],
    languageOptions:{
      ecmaVersion:2023,
      sourceType:'script'
    },
    rules:{
      ...js.configs.recommended.rules,
      'no-undef':'off',
      'no-unused-vars':'off',
      'no-empty':['error',{allowEmptyCatch:true}]
    }
  }
];
