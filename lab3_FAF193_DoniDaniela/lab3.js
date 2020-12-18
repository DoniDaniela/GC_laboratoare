class Figure {
    constructor(vertices, indices, colors) {
        this.vertices = vertices;
        this.colors = colors
        this.indices = indices;

        this.angle = 0;
        this.rotateX = 1;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.rotate = false;
        this.defaultTranslate = [0, 0, 0];

        this.scale = 1.0;

        this.moveX = 0;
        this.moveY = 0;
        this.moveZ = 0;
    }

    enableRotation(rotateX, rotateY, rotateZ) {
        this.rotate = true;
        this.rotateX = rotateX;
        this.rotateY = rotateY;
        this.rotateZ = rotateZ;
    }

    disableRotation() {
        this.rotate = false;
        this.angle = 0;
    }
}

function createCube() {
    return new Figure(
        new Float32Array([
            0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,  -0.5,-0.5, 0.5,   0.5,-0.5, 0.5, 
            0.5, 0.5, 0.5,   0.5,-0.5, 0.5,   0.5,-0.5,-0.5,   0.5, 0.5,-0.5, 
            0.5, 0.5, 0.5,   0.5, 0.5,-0.5,  -0.5, 0.5,-0.5,  -0.5, 0.5, 0.5, 
           -0.5, 0.5, 0.5,  -0.5, 0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5, 
           -0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5, 
            0.5,-0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5 
        ]),
        new Uint8Array([
            0, 1, 2,   0, 2, 3,    
            4, 5, 6,   4, 6, 7,    
            8, 9,10,   8,10,11,    
            12,13,14,  12,14,15,    
            16,17,18,  16,18,19,    
            20,21,22,  20,22,23     
        ]),
        new Float32Array([
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     
            1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　 
        ])
    );
}

function createPyramid() {
    return new Figure(
        new Float32Array([
            0.0, 0.5, 0.0,  
            -0.5, -0.5, 0.5, 
            0.5, -0.5, 0.5,  
            0.5, -0.5, -0.5,  
            -0.5, -0.5, -0.5  
        ]),
        new Uint8Array([
            0, 1, 2,  
            0, 1, 4,  
            0, 3, 4,  
            1, 2, 4, 2, 3, 4 
        new Float32Array([
            1, 1, 1,  
            1, 0.0, 1, 
            1, 0.0, 0.0,  
            1, 1, 0.0,  
            0.0, 1, 0.0,  
        ]),
    );
}

function createCylinder() {
    points = 36 ;
    var vertices = [];
    var colors = [];
    var indices = [];
    const sectors = 2 * Math.PI / points;
    var angle;

    for (let i = 0; i < points; i += 2) {
        angle = i * sectors;
        vertices.push(Math.cos(angle) / 2);
        vertices.push(0.5);
        vertices.push(Math.sin(angle) / 2);
        colors.push(1, 0, 1);
        
            
        vertices.push(Math.cos(angle) / 2);
        vertices.push(-0.5);
        vertices.push(Math.sin(angle) / 2);
        colors.push(1, 1, 0);
        

        if (i % 2 === 0 && i <= points - 4)
            indices.push(i , i + 1, i + 2, i + 1, i + 3, i + 2);
            indices.push(points, i, i + 2);
            indices.push(points + 1, i + 1 , i + 3);
    }

    vertices.push(0, 0.5, 0);
    colors.push(1, 0, 1);
    vertices.push(0, -0.5, 0);
    colors.push(1, 1, 0)

    indices.push(points - 2, points - 1, 0)
    indices.push(points - 1, 1, 0)
    indices.push(points, points - 2, 0)
    indices.push(points + 1, points - 1, 1);

    return new Figure(
        new Float32Array(vertices),
        new Uint8Array(indices),
        new Float32Array(colors)
    );
}

function createConus() {
    points = 22;
    var vertices = [];
    var colors = [];
    var indices = [];
    const sectors = 2 * Math.PI / points;
    var angle;

    vertices.push(0, 0.5, 0);
    colors.push(1, 0, 1)
    for (let i = 0; i < points; i++) {
        angle = i * sectors;
            
        vertices.push(Math.cos(angle) / 2);
        vertices.push(-0.5);
        vertices.push(Math.sin(angle) / 2);
        colors.push(1, 1, 0);
        

        if (i <= points - 2)
            indices.push(0, i, i + 1);
            indices.push(points, i, i + 1);
    }

    vertices.push(0, -0.5, 0);
    colors.push(1, 1, 0);
    indices.push(0, points - 1, 1);

    return new Figure(
        new Float32Array(vertices),
        new Uint8Array(indices),
        new Float32Array(colors)
    );
}

function createSphere() {
    var SPHERE_DIV = 15;
    var positions = [];
    var indices = [];
    var colors = [];

    for (j = 0; j <= SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
            ai = i * 2 * Math.PI / SPHERE_DIV;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            positions.push((si * sj)/1.5);  
            positions.push(cj/1.5);       
            positions.push((ci * sj)/1.5);  

            if (i % 2 === 0) colors.push(0, 0, 1);
            else colors.push(1, 0, 0)
            
        }
    }

    for (j = 0; j < SPHERE_DIV; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {
            p1 = j * (SPHERE_DIV+1) + i;
            p2 = p1 + (SPHERE_DIV+1);

            indices.push(p1);
            indices.push(p2);
            indices.push(p1 + 1);

            indices.push(p1 + 1);
            indices.push(p2);
            indices.push(p2 + 1);
        }
    }

    return new Figure(
        new Float32Array(positions),
        new Uint8Array(indices),
        new Float32Array(colors)
    )
}