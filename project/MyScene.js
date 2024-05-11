import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFshader, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyStem } from "./MyStem.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyLeaf } from "./MyLeaf.js";
import { MyReceptacle } from "./MyReceptacle.js";
import { MyPetal } from "./MyPetal.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
    constructor() {
        super();
        this.stemPositions = [];
        this.nrStems = Math.floor(Math.random() * 4) + 1; // random number of stems
        this.length;   

        // initial yPos for the first stem
        // need to adjust this value later (ex: -95)
        this.yPosStem = 0;
        console.log("nrStems: " + this.nrStems);
        this.stemRadius = 0.2 + Math.random() * (0.5 - 0.2)
        console.log("stemRadius " + this.stemRadius);

        // receptacle receptacleRadius
        this.receptacleRadius = 1.5 + Math.random() * (2.5 - 1.5);
        console.log("receptacleRadius = " + this.receptacleRadius);
        this.receptacleYPos;

        // petals y coord
        this.petalYPos;
        this.numPetals = Math.floor(6 + Math.random() * (10 - 6));
        this.angleIncrement = 2 * Math.PI / this.numPetals;
        console.log("num petals = " + this.numPetals);
        this.petalsAngle = Math.PI / (Math.floor(4 + Math.random() * (12 - 4)));
    }

    init(application) {
        super.init(application);

        this.initCameras();
        this.initLights();

        //Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.plane = new MyPlane(this, 30);
        this.stem = this.enableTextures(true);
        this.leafStem1 = this.enableTextures(true);
        this.leafStem2 = this.enableTextures(true);

        //Objects connected to MyInterface
        this.displayAxis = false;
        this.displayStem = true;
        this.displayLeafStem = true;
        this.displayReceptacle = true;
        this.displayPetals = true;
        this.scaleFactor = 1;

        // terrain texture
        this.terrainTexture = new CGFtexture(this, "images/terrain.jpg");
        this.terrainAppearance = new CGFappearance(this);
        this.terrainAppearance.setTexture(this.terrainTexture);
        this.terrainAppearance.setTextureWrap('REPEAT', 'REPEAT');

        // panorama texture
        this.panoramaTexture = new CGFtexture(this, "images/panorama5.png");
        this.panoramaAppearance = new CGFappearance(this);
        this.panoramaAppearance.setTexture(this.panoramaTexture);
        this.panoramaAppearance.setEmission(1, 1, 1, 1);
        this.panoramaAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.panorama = new MyPanorama(this, this.panoramaAppearance);

        // stem texture
        // this.stemTextureTop = new CGFtexture(this, "images/stemColor.png");
        // this.stemTextureBottom = new CGFtexture(this, "images/stemColor.png");
        this.stemTextureSide = new CGFtexture(this, "images/stemColor.png");
        this.stem = new MyStem(this, 100, 20, this.stemTextureSide);

        // handle stem position        
        for (let i = 0; i < this.nrStems; i++) {
            // generate random stem length
            let minLength = 1.0; // Minimum length for a substem
            let maxLength = 5.0; // Maximum length for a substem
            this.length = minLength + Math.random() * (maxLength - minLength);                
            
            console.log("yPos: " + this.yPosStem);
            console.log("len: " + this.length);
            this.stemPositions.push({ x: 0, y: this.yPosStem, z: 0, length: this.length });
            
            this.yPosStem += this.length;
        }

        // stemLeaf texture 
        // update this stuff and everything related to MyPetal
        this.leafStemTextureTop = new CGFtexture(this, "images/leafColor.png")
        this.leafStemTextureBottom = new CGFtexture(this, "images/leafColor.png");
        this.leafCurvature = Math.PI / (Math.floor(Math.random() * (8 - 5 + 1)) + 5); 
        this.leafRandomValue = Math.random();
        this.leafStem1 = new MyLeaf(this, this.leafStemTextureTop, this.leafStemTextureBottom);
        this.leafStem2 = new MyLeaf(this, this.leafStemTextureTop, this.leafStemTextureBottom);


        // receptacle texture
        this.receptacleTexture = new CGFtexture(this, "images/receptacleColor.png");
        this.receptacle = new MyReceptacle(this, 1000, 10, this.receptacleRadius, this.receptacleTexture);

        // petals
        this.petalTextureTop = new CGFtexture(this, "images/petalColor.png");
        this.petalTextureBottom = new CGFtexture(this, "images/petalColor.png");
        this.petal1 = new MyPetal(this, this.petalTextureTop, this.petalTextureBottom);
        this.petal2 = new MyPetal(this, this.petalTextureTop, this.petalTextureBottom);
    }




    initLights() {
        this.lights[0].setPosition(15, 0, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }
    initCameras() {
        this.camera = new CGFcamera(
            1.0,
            0.1,
            1000,
            vec3.fromValues(50, 10, 15),
            vec3.fromValues(0, 0, 0)
        );
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // Draw axis
        if (this.displayAxis) this.axis.display();

        // ---- BEGIN Primitive drawing section

        this.pushMatrix();
        this.terrainAppearance.apply();
        this.translate(0, -100, 0);
        this.scale(400, 400, 400);
        this.rotate(-Math.PI / 2.0, 1, 0, 0);
        this.plane.display();
        this.popMatrix();

        this.pushMatrix();
        this.panoramaAppearance.apply();
        this.panorama.display();
        this.popMatrix();

        let i = 1;
        if (this.displayStem) {
            let leafCurvature1 = 0;
            let leafCurvature2 = 0;
            let leafValue1 = 0;
            let leafValue2 = 0;
            for (const pos of this.stemPositions) {
                // let k = i % 2 == 1 ? 1 : -1;
                this.pushMatrix();
                this.stemTextureSide.bind();
                this.translate(pos.x, pos.y, pos.z)
                // this.rotate(k * Math.PI/12,1,0,0);
                this.rotate(Math.PI / 2, 1, 0, 0);
                this.scale(this.stemRadius, this.stemRadius, 5);
                this.stem.display();
                this.popMatrix();
                
                if (this.leafRandomValue >= 0.5) {
                    leafCurvature1 = this.leafCurvature;
                    leafCurvature2 = 0; 
                    leafValue1 = 0.6;
                    leafValue2 = 0;   
                }
                else {
                    leafCurvature2 = this.leafCurvature;
                    leafCurvature1 = 0;   
                    leafValue2 = 0.6;
                    leafValue1 = 0;   
                }
                
                if (this.displayLeafStem && i < this.nrStems && this.nrStems > 1) {
                    // Position the leaf at the end of the substem
                    let leafPositionZ = 1.3; 

                    // Render leaf at the end of the substem
                    this.pushMatrix();
                    this.leafStemTextureTop.bind();
                    this.leafStemTextureBottom.bind();
                    this.translate(pos.x, pos.y - leafValue1, pos.z + leafPositionZ);
                    this.rotate(leafCurvature1, 1, 0, 0);   // add soft rotation to the stem leaves
                    this.rotate(Math.PI / 2, 1, 0, 0);
                    this.scale(1.5, 1.5, 1.5);
                    this.leafStem1.display();
                    this.popMatrix();
                    
                    // Render leaf at the end of the substem
                    this.pushMatrix();
                    this.leafStemTextureTop.bind();
                    this.leafStemTextureBottom.bind();
                    this.translate(pos.x, pos.y - leafValue2, pos.z - leafPositionZ);
                    this.rotate(-leafCurvature2, 1, 0, 0);   // add soft rotation to the stem leaves
                    this.rotate(Math.PI, 0, 1, 0);
                    this.rotate(Math.PI / 2, 1, 0, 0);
                    this.scale(1.5, 1.5, 1.5);
                    this.leafStem2.display();
                    this.popMatrix();
                }
                i++;
            }
        }

        if (this.displayReceptacle) {
            this.pushMatrix();
            this.receptacleTexture.bind();
            this.receptacleYPos = this.yPosStem - this.length + this.receptacleRadius;
            this.translate(0,this.receptacleYPos,0);
            this.receptacle.display();
            this.popMatrix();
        }
        
        if (this.displayPetals) {
            this.petalYPos = this.receptacleYPos + this.receptacleRadius/3;
            
            for (let i = 0; i < this.numPetals; i++) {
                let angle = i * this.angleIncrement;

                for (const pos of this.stemPositions) {
                    // Position the leaf at the end of the substem
                    this.petalYPos = this.yPosStem - this.length + this.receptacleRadius;

                    let k = this.leafRandomValue > 0.5 ? 1 : -1;
                    
                    // Render leaf at the end of the substem
                    this.pushMatrix();
                    this.petalTextureTop.bind();
                    this.petalTextureBottom.bind();
                    this.translate(0, this.petalYPos, 0);
                    this.rotate(angle,1,0,0);
                    this.translate(0,0,2.8);
                    this.rotate(k * this.petalsAngle, 0, 1, 0);   // add soft rotation to the stem leaves
                    this.rotate(Math.PI / 2, 1, 0, 0);
                    this.rotate(Math.PI / 4, 1,0,0);
                    this.rotate(Math.PI / 2, 0,1,0);
                    this.scale(1, 1, 1); 
                    this.petal1.display();
                    this.popMatrix();
                    
                    // Render leaf at the end of the substem
                    this.pushMatrix();
                    this.petalTextureTop.bind();
                    this.petalTextureBottom.bind();
                    this.translate(0, this.petalYPos, 0);
                    this.rotate(angle,1,0,0);
                    this.translate(0,0,2.8);
                    this.rotate(k * this.petalsAngle, 0, 1, 0);   // add soft rotation to the stem leaves
                    this.rotate(Math.PI, 0, 1, 0);
                    this.rotate(Math.PI / 2, 1, 0, 0);
                    this.rotate(Math.PI / 4, 1,0,0);
                    this.rotate(Math.PI / 2, 0,1,0);
                    this.scale(1, 1, 1); 
                    this.petal2.display();
                    this.popMatrix();
                }
            }
        }        
        // ---- END Primitive drawing section
    }
}