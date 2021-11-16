/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 125
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// remove the focused state after click,
// otherwise bootstrap will still highlight the link
$("a").mouseup(function(){
    $(this).blur();
})

let downloadLinks = ["RuleRepository/assets/StaticModels/CARLA/Buildings/block01.glb"];
var deferreds = [];
let zip;
let zipName;
$(document).ready(function(){

    function deferredAddZip(url, filename, zip) {
        var deferred = $.Deferred();
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                deferred.reject(err);
            } else {
                zip.file(filename, data, {binary:true});
                deferred.resolve(data);
            }
        });
        return deferred;
    }

    function generateZip(name){
        zip = new JSZip();
        zipName = name;
        // find every checked item
        for (var i in downloadLinks) {
            var url = downloadLinks[i];
            var filename = url.replace(/.*\//g, "");
            deferreds.push(deferredAddZip(url, filename, zip));
        }
    }

    $("#downloadLink").click(function(e) {
        e.preventDefault();
        if (downloadLinks[0].indexOf(".glb") != -1){
            window.open(downloadLinks[0]);
        }
        else{
            $.when.apply($, deferreds).done(function () {
                zip.generateAsync({type:"blob"}).then(function(content) {
                    saveAs(content, zipName + ".zip");
                });
            }).fail(function (err) {
                alert(err);
            });
        }
    });

    $('.demoLink').each(function(){ 
      var ruleName = $(this).attr('href');
      var href = window.location.origin + window.location.pathname;
      var url = "https://www.arcgis.com/apps/CEWebViewer/viewer.html?3dWebScene=" + href + "RuleRepository/models/" + ruleName + ".3ws"
      $(this).attr('href', url);
    }); 

    function getElements(url){
        var url = url.split(".")[0];
        var parts = url.split("/")
        var author  = parts[3];
        var category = parts[4];
        var name = parts[6];
        var modName = name;
        if (name.endsWith("_d")){
            modName = name.slice(0, -2);
        }
        return([author, category, name, modName])
    }

    function splitModels(url){
        var parts = url.split(" - ");
        var author = "CARLA";
        var category = parts[1];
        var name = parts[2].split(".")[0];
        return([author, category, name]);
    }

    function setAttribution(author){
        var authorInfo = sources[author.toLowerCase()];
        var name = authorInfo[0];
        var url = authorInfo[1];
        var license = authorInfo[2];
        var licenseUrl = licenses[license];
        $("#source").text(name);
        $("#source").attr("href", url);
        $("#licence").text(license);
        $("#licence").attr("href", licenseUrl);
    }

    $('.model').on('click', function(event){
        downloadLinks = [];
        $('#renderCanvas').css("display", "none");
        $('#modelViewer').css("display", "block");
        var root = "RuleRepository/assets/StaticModels";
        var url = event.target.attributes['src'].value;
        parts = splitModels(url);
        setAttribution(parts[0]);
        var modelSrc =root + "/" + parts[0] + "/"  + parts[1] + "/"  + parts[2] +  ".glb";
        downloadLinks.push(modelSrc);
        const modelViewer = document.querySelector("model-viewer");
        modelViewer.src = modelSrc;
    });


    $('.material').on( 'click', function( event ) {
      $('#modelViewer').css("display", "none");
      $('#renderCanvas').css("display", "block");
      var img = event.target.currentSrc;
      downloadLinks = [];
      if (img){
        engine.resize();
        var type = event.target.attributes['data-type'].value.split(" ");
        usePBR = parseInt(type[2]);
        
        var url = event.target.attributes['src'].value;
        var parts = getElements(url);
        setAttribution(parts[0]);
        var root = "RuleRepository/assets/Materials";
        var dUrl = root + "/" + parts[0] + "/"  + parts[1] + "/"  + parts[2] +  ".png";
        downloadLinks.push(dUrl);
        var diffuseTexture = new BABYLON.Texture(dUrl, scene);

          if (!usePBR){
            
            mat = new BABYLON.StandardMaterial("mat2", scene);
            mat.diffuseTexture = diffuseTexture;
            mat.detailMap.isEnabled = false;
            

            if (type[0] == "1"){
                var bUrl = root + "/" + parts[0] + "/"  + parts[1] + "/"  + parts[3] + "/" + parts[3] +  "_norm.png";
                downloadLinks.push(bUrl);
                const bumpTexture = new BABYLON.Texture(bUrl, scene);
                mat.bumpTexture = bumpTexture;
                mat.bumpTexture.level = bumpLevel;
                //matStd.detailMap.roughnessBlendLevel = 0.25;
            }
            else{
                mat.bumpTexture = null;
            }
            if (type[1] == "1"){
                var sUrl = root + "/" + parts[0] + "/"  + parts[1] + "/"  + parts[3] + "/" + parts[3] +  "_spec.png";
                downloadLinks.push(sUrl);
                const specTexture = new BABYLON.Texture(sUrl, scene);
                mat.specularTexture = specTexture;
            }
            else{
                mat.specularTexture = null;
            }
            //matStd.bumpTexture = bumpTexture;
            //matStd.bumpTexture.level = 1;
            //matStd.detailMap.roughnessBlendLevel = 0.25;
            var textures = [mat.diffuseTexture, mat.bumpTexture,  mat.specularTexture];
            for (var i in textures){
                if(textures[i]){
                    textures[i].uScale = scale;
                    textures[i].vScale = scale;
                    textures[i].saveUVScale = scale;
                }
            }

            ground.material = mat;
            sphere.material = mat;
            box.material = mat;

            light.intensity = 0.2*lightLevel;
            light2.intensity = 0.6*lightLevel;
            light3.intensity = 0.6*lightLevel;
            //window.mat = matStd;
        }
        else{
            mat = new BABYLON.PBRMaterial("matpbr", scene);
            mat.metallic = 1.0;
            mat.roughness = 0.5;
            mat.albedoTexture = diffuseTexture;

            //matPBR.detailMap.roughnessBlendLevel = 0.25;

            if (type[0] == "1"){
                var bUrl = root + "/" + parts[0] + "/"  + parts[1] + "/"  + parts[3] + "/" + parts[3] +  "_norm.png";
                downloadLinks.push(bUrl);
                mat.bumpTexture = new BABYLON.Texture(bUrl, scene);
                mat.bumpTexture.level = bumpLevel;
                //matStd.detailMap.roughnessBlendLevel = 0.25;
            }
            else{
                mat.bumpTexture = null;
            }

            if (type[1] == "1"){
                var sUrl = root + "/" + parts[0] + "/"  + parts[1] + "/"  + parts[3] + "/" + parts[3] +  "_spec.png";
                downloadLinks.push(sUrl);
                mat.metallicTexture = new BABYLON.Texture(sUrl, scene);
                //matPBR.metallicTexture = roughnessTexture
                mat.useRoughnessFromMetallicTextureAlpha = false;
                mat.useRoughnessFromMetallicTextureGreen = true;
                mat.useMetallnessFromMetallicTextureBlue = true;
                mat.useAmbientOcclusionFromMetallicTextureRed = true
            }
            else{
                mat.metallicTexture = null;
            }

            var ormUrl = root + "/" + parts[0] + "/"  + parts[1] + "/"  + parts[3] + "/" + parts[3] +  "_orm.png";
            downloadLinks.push(ormUrl);
            mat.metallicTexture = new BABYLON.Texture(ormUrl, scene);
            
            var textures = [mat.diffuseTexture, mat.bumpTexture,  mat.specularTexture, mat.metallicTexture, mat.albedoTexture];
            for (var i in textures){
                if(textures[i]){
                    textures[i].uScale = scale;
                    textures[i].vScale = scale;
                    textures[i].saveUVScale = scale;
                }
            }
            
            ground.material = mat;
            sphere.material = mat;
            box.material = mat;

            light.intensity = 1*lightLevel;
            light2.intensity = 20*lightLevel;
            light3.intensity = 20*lightLevel;
        }
        generateZip(parts[2]);
      }
    });

    var $buttonGroup = $('.filters');
    $buttonGroup.on( 'click', 'li', function( event ) {
      $("#realRows").show();
      $("#showingGallery").hide();
      $grid = $('#realRows');
        $grid.isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        filter: ".props"
        });
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      var $button = $( event.currentTarget );
      $button.addClass('is-checked');
      var filterValue = $button.attr('data-filter');
      $grid.isotope({ filter: filterValue });
    });
    let sphere, box, ground;
    let scale = 1;
    let bumpLevel = 0.34;
    let light, light2, light3;
    let usePBR;
    let mat;
    let lightLevel = 1;
    var createScene = function () {

        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3( 1, 1, 1);
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 3, -5.5), scene);
        camera.inertia = 0.7;
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -1, 0), scene);
        light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-1, 5, 3), scene);
        light3 = new BABYLON.PointLight("light3", new BABYLON.Vector3(3, 0, -5), scene);
        sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
        sphere.position.x = -1;
        sphere.position.y = 1;
        box = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene);
        box.position.x = 1.8;
        box.position.y = 1;
        box.position.z = -1.5;

        var root = "RuleRepository/assets/Materials/0ad/rocks/medit_rocks/";
        ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene); 
        const diffuseTexture = new BABYLON.Texture(root + "medit_rocks.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
        const bumpTexture = new BABYLON.Texture(root + "medit_rocks_norm.png", scene);
        const roughnessTexture = new BABYLON.Texture(root + "medit_rocks_spec.png", scene);

        var matStd = new BABYLON.StandardMaterial("mat", scene);

        matStd.diffuseTexture = diffuseTexture;
        matStd.detailMap.isEnabled = false;
        matStd.bumpTexture = bumpTexture;
        matStd.bumpTexture.level = 1;
        matStd.specularTexture = roughnessTexture;
        var matPBR = new BABYLON.PBRMaterial("matpbr", scene);
        //matPBR.metallic = 1.0;
        //matPBR.roughness = 0.5;
        matPBR.albedoTexture = diffuseTexture;
        matPBR.bumpTexture = bumpTexture;
        bumpLevel = 0.34;
        matPBR.bumpTexture.level = bumpLevel;
        matPBR.detailMap.roughnessBlendLevel = 0.25;
        matPBR.metallicTexture = roughnessTexture
        matPBR.useRoughnessFromMetallicTextureAlpha = false;
        matPBR.useRoughnessFromMetallicTextureGreen = true;
        matPBR.useMetallnessFromMetallicTextureBlue = true;
        matPBR.useAmbientOcclusionFromMetallicTextureRed = true
        usePBR = false;

        const setMaterial = () => {

            ground.material = matStd;
            sphere.material = matStd;
            box.material = matStd;

            light.intensity = usePBR ? 1 : 0.2;
            light2.intensity = usePBR ? 20 : 0.6;
            light3.intensity = usePBR ? 20 : 0.6;

            mat = matStd;
        }
        setMaterial();

        // GUI
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var selectBox = new BABYLON.GUI.SelectionPanel("sp");

        selectBox.width = 0.30;
        selectBox.height = 0.7;
        selectBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        selectBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        selectBox.color = "black";
        selectBox.thickness = 0;
        selectBox.headerColor = "black";

        advancedTexture.addControl(selectBox);

        var slidersGroup = new BABYLON.GUI.SliderGroup();
        var sliderRun = function( v){
            var textures = [mat.diffuseTexture, mat.bumpTexture,  mat.specularTexture, mat.metallicTexture, mat.albedoTexture];
            
            for (var i in textures){
                if(textures[i]){
                    textures[i].uScale = 1/v;
                    textures[i].vScale = 1/v;
                    textures[i].saveUVScale = 1/v;
                }
            }
            scale = 1/v;
        }

        var changeBump  = function(v){
            if (mat.bumpTexture) mat.bumpTexture.level = v;
            bumpLevel = v;
        }

        var changeLight  = function(v){
            light.intensity = usePBR ? 1*v : 0.2*v;
            light2.intensity = usePBR ? 20*v : 0.6*v;
            light3.intensity = usePBR ? 20*v : 0.6*v;
            lightLevel = v;
        }
        
        slidersGroup.addSlider("Tile Size", sliderRun, "", 0.1, 2, scale, (v) => v.toFixed(2));
        slidersGroup.addSlider("Bump Level", changeBump, "", 0.01, 1, bumpLevel, (v) => v.toFixed(2));
        slidersGroup.addSlider("Light Level", changeLight, "", 0.5, 2, 1, (v) => v.toFixed(2));
        selectBox.addGroup(slidersGroup);
        let t = 0;

        scene.onBeforeRenderObservable.add(() => {
            sphere.rotation.y = t * 0.5;
            box.rotation.y = t * 0.5;
            t += 0.01;
        });

        return scene;
    }

    const canvas = document.getElementById("renderCanvas"); 
    const engine = new BABYLON.Engine(canvas, true);

    const scene = createScene(); 
    engine.runRenderLoop(function () {
            scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });

});

