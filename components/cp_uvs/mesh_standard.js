/*
*   standard_mesh
*
*   a wrapping of three.js meshStandard to learn how to do it and to provide access to
*   attributes like lightmaps and emissive.
*
*   would like to figure out a way to have alternate names for attrs pass but that's
*   more advanced crap than I can figure right now anyway. I also need to figure out
*   what the envMapIntensity is - float? dfault?
*   Also - figure out how to animate the parameters - Don M implies it's impossible.
*
*/
var texturePromises = {};
var CubeLoader = new THREE.CubeTextureLoader();
AFRAME.registerShader('mesh_standard', {
  schema: {
    diffuse_color: { default: {x: 0.3, y: 0.3, z: 0.3}, type: 'vec3', is: 'uniform'},
    diffuse_map : {type: 'map', is: 'uniform'},

    alphaMap: {type: 'map', is: 'uniform'},
    aoMap: {type: 'map', is: 'uniform'},
    aoMapIntensity: { default: 1.0 },
    bumpMap: {type: 'map', is: 'uniform'},
    bumpScale: { default: 1.0 },
    color: { default: {x: 0.3, y: 0.3, z: 0.3}, type: 'vec3', is: 'uniform' },
    displacementMap: {type: 'map', is: 'uniform'},
    displacementScale: { default: 1.0 },
    displacementBias: { default: 0.0 },
    emissive: { default: {x: 1.0, y: 0.0, z: 0.0}, type: 'vec3', is: 'uniform' },
    emissiveMap: {type: 'map', is: 'uniform'},
    emissiveIntensity: { default: 0.0 },
    //envMap: {type: 'map', is: 'uniform'},
    envMap: {default: ''},
    envMapIntensity: {default: 1.0},
    lightMap: {type: 'map', is: 'uniform'},
    lightMapIntensity: { default: 1.0 },
    map: {type: 'map', is: 'uniform'},
    metalness: { default: 0.0 },
    metalnessMap: {type: 'map', is: 'uniform'},
    morphNormals: { default: false },
    morphTargets: { default: true },
    normalMap: {type: 'map', is: 'uniform'},
    normalScale: { default: {x: 1.0, y: 1.0}, type: 'vec2', is: 'uniform' },
    opacity: { default: 1.0 },
    refractionRation: { default: .98 },
    roughness: { default: .3 },
    roughnessMap: {type: 'map', is: 'uniform'},
    skinning: { default: false },
    sphericalEnvMap: {type: 'map'},
    transparent: { default: false },
    wireframe: { default: false },
    //.wireframeLinecap enum  'round'   "butt", "round" and "square". Default is 'round'.
    //.wireframeLinejoin enum 'round'   "round", "bevel" and "miter". Default is 'round'.
    wireframeLinewidth: { default: 1.0 }
  },

  /**
   * `init` used to initialize material. Called once.
   */
  init: function (data) {
    this.material = new THREE.MeshStandardMaterial();
    // translations from other attribute names to the three.js versions
    if(data.diffuse_map != ""){
      data.map = data.diffuse_map;
    }

    this.setParams(data);
    //console.log(this.material);

  },

  /**
   * `update` used to update the material. Called on initialization and when data updates.
   */
  update: function (data) {

  },

  setParams: function(data){
    if(data.alphaMap){
      this.material.alphaMap = new THREE.TextureLoader().load( data.alphaMap);
    }
    if(data.aoMap){
      this.material.aoMap = new THREE.TextureLoader().load( data.aoMap);
    }
    this.material.aoMapIntensity = data.aoMapIntensity;
    if(data.bumpMap){
      this.material.bumpMap = new THREE.TextureLoader().load( data.bumpMap);
    }
    this.material.bumpScale = data.bumpScale;
    this.material.color = data.color;
    
    if(data.displacementMap){
      this.material.displacementMap = new THREE.TextureLoader().load( data.displacementMap);
    }
    this.material.displacementScale = data.displacementScale;
    this.material.displacementBias = data.displacementBias;
    
    this.material.emissive = new THREE.Color(data.emissive.x, data.emissive.y, data.emissive.z);//data.emissive;
    if(data.emissiveMap){
      this.material.emissiveMap = new THREE.TextureLoader().load( data.emissiveMap);
    }
    this.material.emissiveIntensity = data.emissiveIntensity;
    
    if(data.envMap){
      this.material.envMap = new THREE.TextureLoader().load( data.envMap);
    }
    this.material.envMapIntensity =  data.envMapIntensity;;

    if(data.lightMap){
      this.material.lightMap = new THREE.TextureLoader().load( data.lightMap);
    }
    this.material.lightMapIntensity = data.lightMapIntensity;
    if(data.map){
      this.material.map = new THREE.TextureLoader().load( data.map);
    }
    this.material.metalness = data.metalness;
    if(data.metalnessMap){
      this.material.metalnessMap = new THREE.TextureLoader().load( data.metalnessMap);
    }
    this.material.morphNormals = data.morphNormals;
    this.material.morphTargets = data.morphTargets;
    if(data.normalMap){
      this.material.normalMap = new THREE.TextureLoader().load( data.normalMap);
    }
    this.material.normalScale = data.normalScale;
    this.material.opacity = data.opacity;
    this.material.refractionRation = data.refractionRation;
    this.material.roughness = data.roughness;
    if(data.roughnessMap){
      this.material.roughnessMap = new THREE.TextureLoader().load( data.roughnessMap);
    }
    this.material.skinning = data.skinning;
    this.material.transparent = data.transparent;
    this.material.wireframe = data.wireframe; 

    this.updateEnvMap(data);   
  },
    /**
   * Handle environment cubemap. Textures are cached in texturePromises.
   */
  updateEnvMap: function (data) {
    var self = this;
    var material = this.material;
    var envMap = data.envMap;
    var sphericalEnvMap = data.sphericalEnvMap;

    // No envMap defined or already loading.
    if ((!envMap && !sphericalEnvMap) || this.isLoadingEnvMap) {
      material.envMap = null;
      material.needsUpdate = true;
      return;
    }
    this.isLoadingEnvMap = true;

    // if a spherical env map is defined then use it.
    if (sphericalEnvMap) {
      this.el.sceneEl.systems.material.loadTexture(sphericalEnvMap, {src: sphericalEnvMap}, function textureLoaded (texture) {
        self.isLoadingEnvMap = false;
        texture.mapping = THREE.SphericalReflectionMapping;
        material.envMap = texture;
        AFRAME.utils.material.handleTextureEvents(self.el, texture);
        material.needsUpdate = true;
      });
      return;
    }

    // Another material is already loading this texture. Wait on promise.
    if (texturePromises[envMap]) {
      texturePromises[envMap].then(function (cube) {
        self.isLoadingEnvMap = false;
        material.envMap = cube;
        AFRAME.utils.material.handleTextureEvents(self.el, cube);
        material.needsUpdate = true;
      });
      return;
    }

    // Material is first to load this texture. Load and resolve texture.
    texturePromises[envMap] = new Promise(function (resolve) {
      AFRAME.utils.srcLoader.validateCubemapSrc(envMap, function loadEnvMap (urls) {
        CubeLoader.load(urls, function (cube) {
          // Texture loaded.
          self.isLoadingEnvMap = false;
          material.envMap = cube;
          AFRAME.utils.material.handleTextureEvents(self.el, cube);
          resolve(cube);
        });
      });
    });
  }
});
