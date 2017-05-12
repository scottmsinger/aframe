/*
*   geo_log_data.js
*
*
*/


AFRAME.registerComponent('obj-cp-uvs', {
    multiple: false,
    
    schema: {
        cp_obj: {type: 'selector'},
        newname: {default: "uv2"}
    },
    
    init: function () {
        
        var el_loc = this.el;

        var newname = this.data.newname;
        //var cp_obj = this.data.cp_obj;

        const mesh = this.el.getObject3D('mesh');
        const mesh_cp = this.data.cp_obj.getObject3D('mesh');

        is_ready = false;
        is_ready_cp = false;
        
        //console.log("BEGIN "+el_loc.id+"\n\n");
        //this.cp_obj = document.querySelector(this.data.cp_obj);
        //if (!this.cp_obj) {
	    //        console.warn("Obj to copy UVs from not found.");
	    //}
        //console.log(this.cp_obj);
        //const cp_mesh = this.cp_obj.getObject3D('mesh');
        if(!mesh){
            //console.log(el_loc.id+" No Mesh Yet");
            this.el.addEventListener('object3dset', this.init.bind(this));
            //console.log(this.el.getObject3D());
        }
        else {
            if (!mesh.children.length) {
                //console.log(el_loc.id+" mesh not populated yet");
                this.el.addEventListener('object3dset', this.init.bind(this));
            }
            else {
                //console.log("There was a mesh for "+this.el.id+"\n\tit looks like:");
                //console.log(mesh);
                //console.log("");
                is_ready = true;
            }
        }
        if(is_ready){
            console.log(el_loc.id+" 3D.children[0]");
            console.log(el_loc.object3D.children[0]);
            console.log(el_loc.id+" 3D.children[0].children");
            console.log(el_loc.object3D.children[0].children);
            for(i=0; i< el_loc.object3D.children[0].children.length; i++){
                //console.log(el_loc.id+" 3D.children[0].children["+i+"].geometry.attributes");
                //console.log(el_loc.object3D.children[0].children[i].geometry.attributes);
                //console.log("create the new uv1 array");
                //console.log(el_loc.object3D.children[0].children[i].geometry.attributes.uv.array);
                var uv1 = new Float32Array( el_loc.object3D.children[0].children[i].geometry.attributes.uv.array );
                el_loc.object3D.children[0].children[i].geometry.addAttribute(newname, new THREE.BufferAttribute(uv1, 2));
                //console.log(el_loc.object3D.children[0].children[i].geometry.attributes);
            }
            is_ready = false;
        }

        //
        // deal with the mesh_cp
        if(!mesh_cp){
            console.log(" No Mesh CP Yet");
            this.el.addEventListener('object3dset', this.init.bind(this));
            //console.log(this.el.getObject3D());
        }
        else {
            if (!mesh_cp.children.length) {
                console.log(" mesh_cp not populated yet");
                this.el.addEventListener('object3dset', this.init.bind(this));
            }
            else {
                //console.log("There was a mesh _cp : it looks like:");
                //console.log(mesh_cp);
                //console.log("");
                is_ready_cp = true;
            }
        }
        if(is_ready_cp){

            console.log("mesh_cp");
            console.log(mesh_cp);
            console.log("mesh_cp.children");
            console.log(mesh_cp.children);
            console.log("mesh_cp.children.length");
            console.log(mesh_cp.children.length);
            for(i=0; i< mesh_cp.children.length; i++){
                console.log(mesh_cp.children[i].geometry);
                console.log(el_loc.object3D.children[0].children[i].geometry);
                //console.log(el_loc.id+" 3D.children[0].children["+i+"].geometry.attributes");
                //console.log(mesh_cp.children[0].children[i].geometry.attributes);
                //console.log("create the new uv1 array");
                //console.log(el_loc.object3D.children[0].children[i].geometry.attributes.uv.array);
                // get the UV array of the copy mesh
                //var uv1 = new Float32Array( mesh_cp.children[0].children[i].geometry.attributes.uv.array );
                
                // copy the values of those uv's onto uv2 of the element mesh
                el_loc.object3D.children[0].children[i].geometry.attributes["uv2"].array = mesh_cp.children[i].geometry.attributes["uv"].array.slice();
                //console.log(mesh_cp.children[i].geometry.attributes["uv"]);
                //console.log(el_loc.object3D.children[0].children[i].geometry.attributes["uv2"]);

                
                //el_loc.object3D.children[0].children[i].geometry.addAttribute(newname, new THREE.BufferAttribute(uv1, 2));
                //console.log(el_loc.object3D.children[0].children[i].geometry.attributes);
            }
            is_ready = false;
        }

        //console.log("END "+el_loc.id+"\n\n");
    },

    update: function() {
    }
});


/*
    init: function () {
        console.log("geo_log_data INIT for "+this.el.id);
        //console.log("So here's what this.el");
        //console.log(this.el);
        //console.log("")
        
        const mesh = this.el.getObject3D('mesh');

        console.log("Checking for mesh "+ this.el.id);
        if (!mesh.children.length) {
            console.log("No Mesh Yet)");
            this.el.addEventListener('object3dset', this.init.bind(this));
        }
        else {
            console.log("There was a mesh for "+this.el.id+"\n\tit looks like:");
            console.log(mesh);
            console.log("");
        }

         console.log("\nBEGIN iterate over object3D for "+this.el.id);
         this.el.object3D.traverse(function(node) {
             console.log(node);
            //  if (node.geometry) {
             if (node.children) {
                 console.log("\n children:");
                 console.log(node.children);
                 console.log(node.children[0]);
                 console.log(node.children[0][0]);
                 console.log("");
                 //console.log("\nfirst element of posiiton array "); 
                 //console.log(node.geometry.attributes.position.array[0]);
             }
         });
        console.log("END iteration for "+this.el.id+"\n\n");
    },
*/
