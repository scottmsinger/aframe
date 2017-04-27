/*
*
*   nav_mesh.js
*
*   an AFrame component to constrain an entities motion to the surface of a given 
*   mesh object.
*
*   
*
*/

AFRAME.registerComponent('nav-mesh', {
    multiple: false,
    

    schema: {
        target: {type: 'selector'},
        wasd: {default: 'wasd-controls'},
        y_offset: {default: 1.6}
    },

    init: function() {
        // console.log("init");

        // init object vars
        this.pos_aim = new THREE.Vector3();
        this.dir_aim = new THREE.Vector3();
        this.pos = new THREE.Vector3();
        this.dir = new THREE.Vector3();
        this.pos_marker = new THREE.Vector3();
        this.height = 1.6;
        this.out = new THREE.Vector3(0.0, 0.0, 1.0);
        this.pos_floor = new THREE.Vector3(0.0, 0.0, 0.0);
        this.speed = 0;
        this.target_ready = false;

        is_ready = false;
        const mesh = this.data.target.getObject3D('mesh');
        if(!mesh){
            // console.log(this.data.target.id+" No Mesh Yet");
            this.el.addEventListener('object3dset', this.init.bind(this));
            // console.log(this.data.target.getObject3D());
        }
        else {
            if (!mesh.children.length) {
                this.el.addEventListener('object3dset', this.init.bind(this));
            }
            else {
                is_ready = true;
            }
        }
        if(is_ready){
            this.target_ready = true;
            is_ready = false;
        }

        this.ray = new THREE.Raycaster();

    },

    update: function() {
        // console.log("update");
        
    },

    tick: function (time, timeDelta) {
        // get the current camera position
        this.pos = this.el.object3D.position;

        // copy it to the "floor" posiiton
        this.pos_floor.set(this.pos.x, this.pos.y, this.pos.z);
        // ugly - should not be hard coded at all, but will work for testing
        this.pos_floor.y -= 1.6;
        //console.log(this.pos_floor);

        // get the velocity direction from the wasd-controls
        // need to base this on a component attribute
        // this.dir = this.el.components["sms_wasd-controls"].velocity.clone();
        this.dir = this.el.components[this.data.wasd].velocity.clone();
        //console.log("velocity");
        //console.log(this.dir);
        // flatten it in Y
        this.dir.y = 0;
        this.dir.normalize();
        this.dir.multiplyScalar(.1);

        // the position to aim at is the position on the floor plus the flattened camera dir
        this.pos_aim = this.pos_floor.add(this.dir);
        
        // will need to open this up into a loop over all possible child Meshes
        // initialize the aim direction to the aim posiiton
        this.dir_aim = this.pos_aim.clone();
        // subtract the camera position to get a scaled direction
        this.dir_aim.sub(this.pos);
        // normalize that to get a unit vector direction
        this.dir_aim.normalize();

        if(this.data.target.getObject3D('mesh').children.length){
            //console.log(this.data.target.object3D.children[0].children[0]);
            // set the raycaster to be at camera position pointing down the aim direction
            //this.dir_aim.set(0.0, -1.0, 0.0);
            this.ray.set(this.pos, this.dir_aim);

            //  cast a ray
            //this.data.target.object3D.children[0].children[i].geometry.
            //this.data.target.object3D.children[0]
            var intersectsA = this.ray.intersectObject( this.data.target.object3D.children[0].children[0], false);

            this.dir_aim.set(0.0, -1.0, 0.0);                
            this.ray.set(this.pos, this.dir_aim);

            var intersectsB = this.ray.intersectObject( this.data.target.object3D.children[0].children[0], false);
            //this.pos_marker.set(this.position.x, this.position.y, this.position.z );
            // check for hits
            if(intersectsA[0]){
                // there is a hit
                //console.log(intersects[0].distance);
                //console.log("On Nav Mesh")
                this.pos_marker.set(this.pos.x, this.pos.y, this.pos.z);
                if(intersectsB[0]){
                    this.pos_marker.add(this.dir_aim.multiplyScalar(intersectsB[0].distance));
                    //this.el.object3D.position.set(this.pos_marker.x, this.pos_marker.y + 1.6, this.pos_marker.z);
                    this.el.setAttribute('position', {
                        x: this.pos_marker.x,
                        y: this.pos_marker.y + this.data.y_offset,
                        z: this.pos_marker.z
                    });
                    //this.el.components["wasd-controls"].acceleration = 1.0;
                    //console.log(this.el.components["wasd-controls"].acceleration)
                }
                else{
                    //console.log("hit on vel cast but not on vertical cast");
                }
            }
            else{
                // there isn't a hit
                this.el.setAttribute('position', {
                        x: this.pos_marker.x,
                        y: this.pos_marker.y + this.data.y_offset,
                        z: this.pos_marker.z
                });
            }
        }

    }
});
