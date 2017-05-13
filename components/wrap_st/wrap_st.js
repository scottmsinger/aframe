/*
 *  wrap_st.js
 *
 */


AFRAME.registerComponent('wrap_st', {
    multiple: false,
    
    schema: {
        maps: { default : ["map"]}
    },
    
    init: function () {
        //console.log("\n\nWRAP_ST: BEGIN");
        //console.log(this.data.maps);

        for(i=0;i<this.data.maps.length;i++){
            // console.log(this.data.maps[i]);
            // console.log(this.el.object3D.children[0].material[this.data.maps[i]].wrapS);
            this.el.object3D.children[0].material[this.data.maps[i]].wrapS = 1000;
            // console.log(this.el.object3D.children[0].material[this.data.maps[i]].wrapS);
            // console.log(this.el.object3D.children[0].material[this.data.maps[i]].wrapT);
            this.el.object3D.children[0].material[this.data.maps[i]].wrapT = 1000;
            // console.log(this.el.object3D.children[0].material[this.data.maps[i]].wrapT);
        }

        // console.log("WRAP_ST: END\n\n");

    }
 });






 /*

 material at same level as geometry
 material->map(object)->wrapS
 material->map(object)->wrapT
*/