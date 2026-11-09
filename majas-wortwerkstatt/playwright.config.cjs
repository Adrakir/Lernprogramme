'use strict';
const path=require('node:path');
const {defineConfig}=require('@playwright/test');
const port=8765;
module.exports=defineConfig({
  testDir:'./e2e',
  timeout:30000,
  expect:{timeout:8000},
  fullyParallel:true,
  forbidOnly:Boolean(process.env.CI),
  retries:process.env.CI?1:0,
  workers:process.env.CI?2:undefined,
  reporter:process.env.CI?[['list'],['html',{open:'never'}]]:'list',
  use:{
    baseURL:'http://127.0.0.1:'+port+'/majas-wortwerkstatt/',
    trace:'retain-on-failure',
    screenshot:'only-on-failure',
    video:'off'
  },
  projects:[
    {name:'desktop-chromium',use:{browserName:'chromium',viewport:{width:1280,height:850}}},
    {name:'mobile-chromium',use:{browserName:'chromium',viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
    {name:'tablet-chromium',use:{browserName:'chromium',viewport:{width:810,height:1080},isMobile:true,hasTouch:true,deviceScaleFactor:2}}
  ],
  webServer:{
    command:'python3 -m http.server '+port+' --bind 127.0.0.1',
    cwd:path.resolve(__dirname,'..'),
    url:'http://127.0.0.1:'+port+'/majas-wortwerkstatt/',
    reuseExistingServer:!process.env.CI,
    timeout:30000
  }
});
