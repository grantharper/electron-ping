const { app, Menu, Tray } = require('electron');
const notify = require('electron-main-notification');
const path = require('path');
const ping = require('ping');

const domainToPing = 'google.com';

const blackIcon = path.join(__dirname, 'tray_icon_black.png');
const purpleIcon = path.join(__dirname, 'tray_icon_purple.png');
let wifiState = null;
let tray = null;

app.on('ready', () => {
    tray = new Tray(blackIcon);
    const contextMenu = Menu.buildFromTemplate([
        { role: 'quit' },
        {
            label: 'Hello!',
            click() { sayHello() }
        }
    ]);
    tray.setToolTip('Internet Status');
    tray.setContextMenu(contextMenu);

    setInterval(function() {
      ping.promise.probe(domainToPing).then(function (pingResponse) {
        console.log('alive: ' + pingResponse.alive);
        console.log('time (ms): ' + pingResponse.time);
        if(wifiState != pingResponse.alive){
          console.log('wifi state change detected');
          if(wifiState){
            console.log('notifying that wifi is down');
            wifiState = false;
            tray.setImage(blackIcon);
            notify('Internet Status Change', {
              body: 'Connectivity has been lost',
              silent: true
            });
          }else{
            console.log('notifying that wifi is up');
            wifiState = true;
            tray.setImage(purpleIcon);
            notify('Internet Status Change', {
              body: 'Connectivity has been restored',
              silent: true
            });
          }
        }
      });

    }, 1000);
});

function sayHello() {
    console.log("Hello from function!");
}

function getIconImage(icon){
	var dirname = __dirname;
	var fullPath = path.join(__dirname, icon);
	console.log('fullPath: ' + fullPath);
	return fullPath;
}

//the below functions are unable to send notifications

function notifyWifiStateChange() {
  console.log('wifi state change detected');
  if(wifiState){
    notifyWifiDown();
  }else{
    notifyWifiUp();
  }
}

function notifyWifiDown() {
  console.log('notifying that wifi is down');
  wifiState = false;
  notify('Dead!', {
    body: 'Internet is down',
    silent: false
  });
}

function notifyWifiUp() {
  console.log('notifying that wifi is up');
  wifiState = true;
  notify('Alive!', {
    body: 'Internet is up' + pingResponse.time,
    silent: false
  });
}
