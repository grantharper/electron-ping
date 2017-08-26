const { app, Menu, Tray } = require('electron');
const notify = require('electron-main-notification');
const path = require('path');
const ping = require('ping');

const domainToPing = 'google.com';

const blackIcon = 'tray_icon_black.png';
const purpleIcon = 'tray_icon_purple.png';
let imageState = purpleIcon;
let imagePath = getIconImage(purpleIcon);
let wifiState = null;
let tray = null;

app.on('ready', () => {
    tray = new Tray(imageState);
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
            imageState = blackIcon;
            notify('Dead!', {
              body: 'Internet is down',
              silent: false
            });
          }else{
            console.log('notifying that wifi is up');
            wifiState = true;
            tray.setImage(purpleIcon);
            imageState = purpleIcon;
            notify('Alive!', {
              body: 'Internet is up',
              silent: false
            });
          }
        }
      });

    }, 1000);
});

function sayHello() {
    console.log("Hello from function!");
}

function changeIcon(imageState) {
    console.log(imageState);
    if (imageState == 'tray_icon_black.png') {
        tray.setImage('tray_icon_purple.png');
        imageState = 'tray_icon_purple.png';
    } else {
        tray.setImage('tray_icon_black.png');
        imageState = 'tray_icon_black.png';
    }
    return imageState;
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
