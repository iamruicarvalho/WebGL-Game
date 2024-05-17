import { CGFobject } from "../lib/CGF.js";

export class MyGrassPortion extends CGFobject {
    constructor(scene) {    
		super(scene);
		this.initBuffers();
	}

    initBuffers() {
        // Define a thin, elongated triangle
        this.vertices = [
            -0.05, 0, 0,   // Bottom left
            0.05, 0, 0,    // Bottom right
            0, 1, 0,       // Top center
        ];

        this.indices = [
            0, 1, 2,
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];

        this.texCoords = [
            0, 0,
            1, 0,
            0.5, 1,
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}