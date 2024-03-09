import { CGFobject } from "../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";

export class MyUnitCubeQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.myQuad = new MyQuad(this.scene);
    }

    display() {
        // Front
        this.scene.pushMatrix();
        this.scene.translate(0,0,0.5);
        this.myQuad.display();
        this.scene.popMatrix();

        // Back
        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.myQuad.display();
        this.scene.popMatrix();

        // Right
        this.scene.pushMatrix();
        this.scene.translate(0.5,0,0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.myQuad.display();
        this.scene.popMatrix();

        // Left
        this.scene.pushMatrix();
        this.scene.translate(-0.5,0,0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);        
        this.myQuad.display();
        this.scene.popMatrix();

        // Top
        this.scene.pushMatrix();
        this.scene.translate(0,0.5,0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.myQuad.display();
        this.scene.popMatrix();

        // Bottom
        this.scene.pushMatrix();
        this.scene.translate(0,-0.5,0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.myQuad.display();
        this.scene.popMatrix();
    }
}