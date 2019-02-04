import { SceneViewer } from './sceneviewer.js';
import './style.css';


let viewport = document.createElement( 'div' );
viewport.id = 'viewport';
document.body.appendChild( viewport );
let viewer = new SceneViewer( viewport );
viewer.animate();


// TODO: create class for Connection


let DEFAULT_HOST = "localhost";
let DEFAULT_PORT = "9422";
let SUBPROTOCOL = "ssr-json";

let SOCKET;

let SOURCES = {};

SOCKET = new WebSocket("ws://" + DEFAULT_HOST + ":" + DEFAULT_PORT, SUBPROTOCOL);

SOCKET.onopen = function()
{
  console.log("WebSocket connected to " + SOCKET.url + ", subprotocol: " + SOCKET.protocol);
  SOCKET.send(JSON.stringify(["subscribe", ["scene"]]));
};

SOCKET.onmessage = function(msg)
{
  viewer.handle_message(msg.data);
};

SOCKET.onerror = function()
{
  alert("WebSocket Error!");
};

SOCKET.onclose = function(msg)
{
  console.log("WebSocket closed");
};
