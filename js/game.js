// Of web wel supported met pixi is
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}
PIXI.utils.sayHello(type)
// --------------------------------
//Create a Pixi Application
let app = new PIXI.Application({
    width: 1280,
    height: 720
});

document.getElementById('container').appendChild(app.view);
