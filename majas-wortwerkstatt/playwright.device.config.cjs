'use strict';
/*
 * Geräteähnliche Browser-Engine-Prüfung.
 * WebKit bildet Safari-Codepfade ab, ist aber KEIN reales iPhone/iPad.
 * Chromium Android ist eine Touch-Emulation, kein echtes Android-Gerät.
 */
const base=require('./playwright.config.cjs');
const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
 ...base,
 testMatch:'**/device-audit.spec.cjs',
 timeout:45000,
 retries:process.env.CI?1:0,
 workers:process.env.CI?2:undefined,
 projects:[
  {name:'iphone-webkit-emulated',use:{browserName:'webkit',viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
  {name:'ipad-webkit-emulated',use:{browserName:'webkit',viewport:{width:810,height:1080},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
  {name:'android-chromium-emulated',use:{browserName:'chromium',viewport:{width:393,height:873},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
  {name:'desktop-firefox',use:{browserName:'firefox',viewport:{width:1280,height:850}}},
  {name:'small-phone-webkit',use:{browserName:'webkit',viewport:{width:320,height:650},isMobile:true,hasTouch:true,deviceScaleFactor:2}}
 ]
});
