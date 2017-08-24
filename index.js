const { app, Menu, Tray } = require('electron');
const notify = require('electron-main-notification');
const path = require('path');

const blackIcon = 'tray_icon_black.png';
const purpleIcon = 'tray_icon_purple.png';
var imageState = purpleIcon;
var imagePath = getIconImage(purpleIcon);

let tray = null;
app.on('ready', () => {
    
    setInterval(function() {
        notify('Hi!', { 
        	body: 'I\'m your awesome electron app!',
        	silent: true,
        	image: imagePath
        })
    }, 3000)
    tray = new Tray(imageState)
    const contextMenu = Menu.buildFromTemplate([
        { role: 'quit' },
        {
            label: 'Hello!',
            click() { sayHello() }
        },
        {
            label: 'change icon',
            click() { imageState = changeIcon(imageState) }
        }
    ])
    tray.setToolTip('Internet Status')
    tray.setContextMenu(contextMenu)
})

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