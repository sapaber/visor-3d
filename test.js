let video;
let poseNet;
let persona = null
let manoDcha = null
let manoIzq = null
let skeletons = [];
let fiabilidad = 0.6
let modelo
let rotacionY = 0
const difRotacion = 0.2

const estadoMano = document.getElementById('estado-mano')

function setup() {
    const width = 640
    const height = 480
    createCanvas(width, height, WEBGL);

    /*if(roberto.isTouching(pinga)){
        pinga.width++
    }*/

    setupSkeletonDetection()
    setupScene()
}

function setupSkeletonDetection() {
    video = createCapture(VIDEO);
    video.size(width, height);

    poseNet = ml5.poseNet(video, modelReady);

    poseNet.on('pose', detectarPersonas);

    video.hide();
}

function setupScene() {
    modelo = loadModel('https://raw.githubusercontent.com/kivy/kivy/master/examples/3Drendering/monkey.obj',true)

}

function draw() {
    background("#222222");
    rotateY(rotacionY);
    model(modelo);
}


function modelReady() {

}

function detectarPersonas(personas) {
    if (personas.length === 0) return
    persona = personas[0]
    if (typeof persona.pose.keypoints !== 'undefined') {
        const manoDerecha = persona.pose.keypoints.find(x => x.part === 'rightWrist')
        const manoIzquierda = persona.pose.keypoints.find(x => x.part === 'leftWrist')

        estadoMano.innerHTML = ''

        if (manoDerecha.score > fiabilidad) {
            manoDcha = manoDerecha
        }
        else {
            manoDcha = null
        }

        if (manoIzquierda.score > fiabilidad) {
            manoIzq = manoIzquierda
        }
        else {
            manoIzq = null
        }


        if (manoIzq !== null && manoDcha !== null) {
            if(manoIzq.position.y > manoDcha.position.y){
                rotacionY += difRotacion
            }
            else{
                rotacionY-= difRotacion
            }


        }


    }
}
