import { SceneViewer } from './sceneviewer.js';
import './style.css';


let viewport = document.createElement( 'div' );
viewport.id = 'viewport';
document.body.appendChild( viewport );
let viewer = new SceneViewer( viewport );
viewer.animate();

let buttons = document.createElement( 'div' );
buttons.id = 'buttons';
let button1 = document.createElement( 'button' );
button1.textContent = 'hello';
button1.onclick = function () { alert('hello!'); };
buttons.appendChild( button1 );
document.body.appendChild( buttons );


let hud = document.createElement( 'div' );
hud.id = 'hud';
hud.className = 'visible';
let hud1 = document.createElement( 'div' );
hud1.id = 'hud1';
hud1.className = 'transparent';
hud1.textContent = 'HUD 1';
let hud2 = document.createElement( 'div' );
hud2.id = 'hud2';
hud2.className = 'transparent';
hud2.textContent = 'HUD 2';
hud.appendChild( hud1 );
hud.appendChild( hud2 );
document.body.appendChild( hud );


// TODO: create class for Connection


let DEFAULT_HOST = "localhost";
let DEFAULT_PORT = "9422";
let SUBPROTOCOL = "asdf-test";

let SOCKET;

let SOURCES = {};

SOCKET = new WebSocket("ws://" + DEFAULT_HOST + ":" + DEFAULT_PORT, SUBPROTOCOL);

SOCKET.onopen = function()
{
  console.log("WebSocket connected to " + SOCKET.url + ", subprotocol: " + SOCKET.protocol);
  SOCKET.send(JSON.stringify("start"));
};

SOCKET.onmessage = function(msg)
{
  viewer.handle_message(JSON.parse(msg.data));
};

SOCKET.onerror = function()
{
  alert("WebSocket Error!");
};

SOCKET.onclose = function(msg)
{
  console.log("WebSocket closed");
};
