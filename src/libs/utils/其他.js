import config from '@/utils/config'
export function loadmapdata() {
    window.viewer = null;
    window.mousemove = null;
    
    window.tilesetModel=[];
    window.clippingPlanes = null;
    window.planeEntities = [];
    window.targetY = 80.0;
    window.selectedPlane = null;
    window.moveHandler = [];
    window.jsonHandler = null;
    window.jsonmoveHandler = null;
    window.silhouetteBlue = null;
    window.silhouetteGreen = null;
    window.selected = {
        feature: undefined,
        originalColor: new Cesium.Color(),
    };
    window._pm_position = null;
    window._cartesian = null;
    window.test = null;
    window.outline = true;
    window.boundingSphere = null;

    window.three = {
        scene: null, //场景
        camera: null, //相机
        renderer: null, //webgl渲染器
        raycaster: null, //射线
        mouse: null, //二维向量
        outlinePass: null, //外轮廓边框
        composer: null, //后处理对象
        renderPass: null, //渲染器通道
        fxaa: null, //快速近似抗锯齿
        ssao: null, //ssao
        ssaa: null, //ssaa
        smaa: null, //多重采样抗锯齿
        depthRenderTarget: null, //缓冲，用于在一个图像显示在屏幕上之前先做一些处理
        rendertype: 'composer', //render类型，renderer/composer
        bloomPass: null, //后期处理效果 - unreal bloom
        _3Dobjects: [], //所有three对象
    };
    window.listener = false; //事件监听器
    window.raycastertype = []; //射线获取到物体要执行的类型
    window.chooseMesh = null; //模型描边 被选中的three对象
    window.resultparams = {}; //模型需要改变的参数
    window.colorresult = []; //模型改变颜色 被选中的three对象
    //泛光效果 - 需和灯光配合
    window.bloomPassparams = {
        exposure: 0.4619,
        threshold: 0,
        strength: 0.897,
        radius: 1
        // exposure: 1.2521,
        // threshold: 0,
        // strength: 2.19,
        // radius: 0.43
    }
}

//初始化cesium
export const initmap = function () {
    if (window.viewer != undefined) return;
    loadmapdata();
    window.viewer = new Cesium.Viewer('cesiumContainer', {
        skyBox: new Cesium.SkyBox({
            show: false
        }),
        navigation: false, //导航栏
        animation: false,
        vrButton: false,
        baseLayerPicker: false,
        geocoder: false,
        shouldAnimate: false,
        timeline: false, //时间线
        sceneModePicker: false, //场景模式选择器
        navigationHelpButton: false, //导航帮助按钮
        fullscreenButton: false, //全屏按钮
        homeButton: false, //主页按钮
        selectionIndicator: false,
        infoBox: false,
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //     url: "http://127.0.0.1:8099/TMS/{z}/{x}/{y}.png",
        //     "minimumLevel": 0,
        //     "maximumLevel": 17,
        //     credit: ''
        // }),
        terrainShadows: Cesium.ShadowMode.DISABLED,
        contextOptions: {
            webgl: {
                alpha: true,
            }
        },
    });
    window.viewer._cesiumWidget._creditContainer.style.display = "none";
    let scene = viewer.scene;
    scene.globe.depthTestAgainstTerrain = true;

    scene.skyBox.show = false;
    scene.backgroundColor = Cesium.Color.fromCssColorString("#C2C2C2"); // 自定义背景色
    scene.globe.baseColor = Cesium.Color.fromCssColorString("#C2C2C2"); //设置地球颜色

    scene.fxaa = true;
    scene.postProcessStages.fxaa.enabled = true;
    scene.moon.show = false;
    scene.sun.show = false;
    scene.fog.enabled = false; //雾
    scene.skyAtmosphere.show = false; // 关闭天空大气层

    scene.globe.show = false; //不显示地球，这条和地球透明度选一个就可以
    scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0);
    scene.backgroundcolor = new Cesium.Color(0, 0, 0, 0);

    //亮度设置
    scene.brightness = scene.brightness ||
        scene.postProcessStages.add(
            Cesium.PostProcessStageLibrary.createBrightnessStage());
    scene.brightness.enabled = true;
    scene.brightness.uniforms.brightness = Number(1.2);

    scene.screenSpaceCameraController.enableCollisionDetection = false; //禁止碰撞检测，视角转入地下
    scene.globe.depthTestAgainstTerrain = true; //开启地形深度检测


    //屏蔽Cesium的默认双击追踪选中entity行为
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    //设定白天时间
    let start = Cesium.JulianDate.fromIso8601('2022-05-17T01:00:42Z');
    //设置时钟当前时间
    viewer.clock.currentTime = start.clone();


    // 设置地图初始化显示位置
    window.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.75231911714071, 33.55003041525994, 127.38573281954044),
        orientation: {
            heading: 4.7121393353731165,
            pitch: -0.20979606656735061,
            roll: 0.0000023471664505336776
        }
    });
}

//cesium 飞行
export const fly = function (lon, lat, h, heading, pitch, roll, duration) {
    
    var center = Cesium.Cartesian3.fromDegrees(lon, lat, h);
    viewer.camera.flyTo({
        destination: center,
        orientation: {
            heading: parseFloat(heading),
            pitch: parseFloat(pitch),
            roll: parseFloat(roll)
        },
        duration: duration
    });
}

//开启 cesium 鼠标监听
export const startmousemove = function (type) {
    if (!window.mousemove) window.mousemove = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    if (type == 'getlocation') {
        //获取经纬度坐标
        window.mousemove.setInputAction(function (movement) {
            var ellipsoid = viewer.scene.globe.ellipsoid;
            var cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
            if (cartesian) {
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                console.log('lon:' + Cesium.Math.toDegrees(cartographic.longitude) + ', ' + Cesium
                    .Math
                    .toDegrees(
                        cartographic.latitude) + ', ' + cartographic.height);
            }

            let pick = new Cesium.Cartesian2(movement.position.x, movement.position.y)
            if (pick) {
                // let cartesian1 = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene)
                var cartesian1 = viewer.camera.pickEllipsoid(movement.position);

                var cartographic1 = Cesium.Cartographic.fromCartesian(
                    cartesian1,
                    viewer.scene.globe.ellipsoid,
                    new Cesium.Cartographic()
                )
                console.log('点击经纬度：lon=' + Cesium.Math.toDegrees(cartographic1.longitude) + ', lat=' + Cesium.Math
                    .toDegrees(
                        cartographic1.latitude) + ', height=' + cartographic1.height);

                if (cartesian1) {
                    var xyz = new Cesium.Cartesian3(cartesian1.x, cartesian1.y, cartesian1.z);
                    var wgs84 = ellipsoid.cartesianToCartographic(xyz);
                    console.log('点击经纬度：lon=' + Cesium.Math.toDegrees(wgs84.longitude) + ', lat=' + Cesium.Math
                        .toDegrees(
                            wgs84.latitude) + ', height=' + wgs84.height);
                }
            }

            var lonlat_height = viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.position);
            console.log('lon:' + Cesium.Math.toDegrees(lonlat_height.longitude) + ', ' + Cesium
                .Math
                .toDegrees(lonlat_height.latitude) + ', ' + lonlat_height.height);
            console.log("heading: " + viewer.camera.heading);
            console.log("pitch:" + viewer.camera.pitch);
            console.log("roll:" + viewer.camera.roll);

            console.log(Cesium.Math.toDegrees(lonlat_height.longitude) + ', ' + Cesium.Math.toDegrees(lonlat_height.latitude) + ', ' + lonlat_height.height+ ', '+viewer.camera.heading+ ', '+viewer.camera.pitch+ ', ' +viewer.camera.roll)

            // var cartographic4 = ellipsoid.cartesianToCartographic(cartesian);
            // var x = Cesium.Math.toDegrees(cartographic4.longitude);
            // var y = Cesium.Math.toDegrees(cartographic4.latitude);
            // var z = cartographic4.height;

            // const p0 = Cesium.Cartesian3.fromDegrees(x, y, 0);
            // const p1 = Cesium.Cartesian3.fromDegrees(x, y, 100);
            // var direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(p0, p1, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            // var ray = new Cesium.Ray(p1, direction);
            // //根据面坐标cartesiantwo 判断是否为加载的模型 
            // var pick1 = viewer.scene.pickFromRay(ray);
            // console.log(pick1)
            // if (pick1) {
            //     if (pick1.tileset instanceof Cesium.Cesium3DTileset) {
            //         bol = true;
            //         beal = false;
            //     }
            // }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}





//移除 cesium 鼠标监听
export const removemousemove = function () {
    if (window.mousemove) {
        window.mousemove.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        window.mousemove.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
    window.mousemove = null;
}


//加载 3dtileset
export const add3dtileset = function (obj) {
    for (const i in obj) {
        let array = viewer.scene.primitives._primitives;
        let box = true;
        for (let o = 0; o < array.length; o++) {
            const element = array[o];
            if (element.isCesium3DTileset && element._url == obj[i].url) {
                box = false;
            }
        }
        if (box) {
            var tilesetModel = new Cesium.Cesium3DTileset({
                url: obj[i].url,
                show:obj[i].show,
                skipLevelOfDetail: true,
                baseScreenSpaceError: 1024,
                maximumScreenSpaceError: 256, // 数值加大，能让最终成像变模糊
                skipScreenSpaceErrorFactor: 16,
                skipLevels: 1,
                immediatelyLoadDesiredLevelOfDetail: false,
                loadSiblings: true, // 如果为true则不会在已加载完概况房屋后，自动从中心开始超清化房屋
                cullWithChildrenBounds: true,
                cullRequestsWhileMoving: true,
                cullRequestsWhileMovingMultiplier: 10, // 值越小能够更快的剔除
                preloadWhenHidden: true,
                preferLeaves: true,
                maximumMemoryUsage: 128, // 内存分配变小有利于倾斜摄影数据回收，提升性能体验
                progressiveResolutionHeightFraction: 0.5, // 数值偏于0能够让初始加载变得模糊
                dynamicScreenSpaceErrorDensity: 0.5, // 数值加大，能让周边加载变快
                dynamicScreenSpaceErrorFactor: 1,
                dynamicScreenSpaceError: true, // 全屏加载完清晰化房屋
            });
            // var height = obj[i].height; //根据地形设置调整高度
            tilesetModel.readyPromise.then(function (tilesetModel) {
                window.viewer.scene.primitives.add(tilesetModel)
                AdjustModel(tilesetModel, {
                    tx: obj[i].tx, //模型中心X轴坐标(经度，单位：十进制度)
                    ty: obj[i].ty, //模型中心Y轴坐标(纬度，单位：十进制度)
                    tz: obj[i].tz, //模型中心Z轴坐标(高程，单位：米)
                    rx: obj[i].rx, //X轴（经度）方向旋转角度(单位：度)
                    ry: obj[i].ry, //Y轴（纬度）方向旋转角度(单位：度)
                    rz: obj[i].rz //Z轴（高程）方向旋转角度(单位：度)
                })
                //贴地显示
                // var cartographic = Cesium.Cartographic.fromCartesian(tilesetModel.boundingSphere.center);
                // var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
                // var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
                // var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
                // tilesetModel.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
                // window.boundingSphere = tilesetModel.boundingSphere;

                // window.viewer.zoomTo(tilesetModel);
                if(i=="0"){
                    window.tilesetModel=tilesetModel
                    // loadTileset();//创建切面
                }
                
            })
        }
    }
}

//加载 GeoJson
export const addGeoJson = function (obj) {
    for (const i in obj) {
        var ft_way1 = viewer.dataSources.add(
            Cesium.GeoJsonDataSource.load(
                obj[i].url, {
                    strokeWidth: obj[i].strokeWidth,
                }));
        ft_way1.then(function (dataSource) {
            var entities = dataSource.entities.values;
            let arr = [];
            for (var o = 0; o < entities.length; o++) {
                var r = entities[o];
                var _linevalue = r.polyline._positions._value;
                r.polyline.material = obj[i].m;
                if (arr.length == 0) {
                    arr[0] = {};
                    arr[0]['name'] = r._name;
                    arr[0]['label'] = obj[i].style;
                    arr[0]['linepositions'] = [];
                    arr[0]['linepositions'].push(_linevalue);
                } else {
                    let bolindex = -1;
                    for (let j = 0; j < arr.length; j++) {
                        const element = arr[j];
                        if (element.name == r._name) {
                            bolindex = j;
                        }
                    }
                    if (bolindex != -1) {
                        arr[bolindex]['linepositions'].push(_linevalue);
                    } else {
                        arr[arr.length] = {};
                        arr[(arr.length - 1)]['name'] = r._name;
                        arr[(arr.length - 1)]['label'] = obj[i].style;
                        arr[(arr.length - 1)]['linepositions'] = [];
                        arr[(arr.length - 1)]['linepositions'].push(_linevalue);
                    }
                }
            }
            console.log(arr)
            screenentities(arr)
        });
    }
}

//筛选 entities 用于添加 label
export const screenentities = function (data) {
    let ellipsoid = viewer.scene.globe.ellipsoid;
    for (let i = 0; i < data.length; i++) {
        if (data[i].name == undefined) return;
        const linepositions = data[i].linepositions;
        let arr = [];
        //计算每条线的长度
        for (let o = 0; o < linepositions.length; o++) {
            const positions = linepositions[o];
            let linearr = [];
            for (let p = 0; p < positions.length; p++) {
                const element = positions[p];
                const cartesian3 = new Cesium.Cartesian3(element.x, element.y, element.z);
                const cartographic = ellipsoid.cartesianToCartographic(cartesian3);
                linearr.push([Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)])
            }
            arr[o] = {};
            arr[o]['num'] = o;
            arr[o]['length'] = turf.length(turf.lineString(linearr), {
                units: 'miles'
            });;
        }
        //根据长度排序
        arr.sort((a, b) => b.length - a.length);
        //计算每条线线的中点
        for (let j = 0; j < 5; j++) {
            const element = arr[j];
            let _positions = linepositions[element.num];
            let _arr = [],
                _arrline = [];
            for (let k = 0; k < _positions.length; k++) {
                const element = _positions[k];
                const cartesian3 = new Cesium.Cartesian3(element.x, element.y, element.z);
                const cartographic = ellipsoid.cartesianToCartographic(cartesian3);
                const lonlat = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
                _arr.push(turf.point(lonlat))
                _arrline.push(lonlat);
            }
            //计算多个点的绝对中心点
            const center = turf.center(turf.featureCollection(_arr));
            //点到线的最短距离的点
            const snapped = turf.nearestPointOnLine(
                turf.lineString(_arrline),
                turf.point([center.geometry.coordinates[0], center.geometry.coordinates[1]]), {
                    units: 'miles'
                });
            addentities({
                type: 'label',
                name: 'linelabel',
                x: snapped.geometry.coordinates[0],
                y: snapped.geometry.coordinates[1],
                z: 3,
                text: data[i].name,
                scale: data[i].label.scale == undefined ? 1.0 : data[i].label.scale,
                fillColor: data[i].label.fillColor,
                outlineColor: data[i].label.outlineColor,
                outlineWidth: data[i].label.outlineWidth,
                showB: data[i].label.showB == undefined ? false : data[i].label.showB,
                backgroundColor: data[i].label.backgroundColor,
            })
        }
    }
}

//加载 entities
export const addentities = function (obj) {
    if (obj.type = 'label') {
        viewer.entities.add({
            name: obj.name,
            position: Cesium.Cartesian3.fromDegrees(obj.x, obj.y, obj.z),
            label: { //文字标签
                text: obj.text,
                font: '500 40px 楷体', // 15pt monospace
                scale: obj.scale,
                style: Cesium.LabelStyle.FILL,
                fillColor: obj.fillColor,
                outlineColor: obj.outlineColor,
                outlineWidth: obj.outlineWidth,
                showBackground: obj.showB,
                backgroundColor: obj.backgroundColor,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scaleByDistance: new Cesium.NearFarScalar(100, 0.8, 25000, 0)
            }
        })
    }
}

//加载 glb、gltf
export const addglb = function () {
     let nuantongMode = viewer.entities.getById("nuantong");
    if( nuantongMode==undefined){
        var position = Cesium.Cartesian3.fromDegrees(
            parseFloat(114.75019814983528), parseFloat(33.54870394015111), parseFloat(50));
        var heading = Cesium.Math.toRadians(parseFloat(0));
        var hpr = new Cesium.HeadingPitchRoll(heading, 0, 0);
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        viewer.entities.add({
            id: 'nuantong',
            position: position,
            orientation: orientation,
            model: {
                uri: config.tilestUrl+"nuantong.glb",
                color: Cesium.Color.WHITE.withAlpha(1),//透明度
                // alpha:0.5
            },
        });
        
    }else{
        if(viewer.entities.getById("nuantong").show==true) return
        viewer.entities.getById("nuantong").show = true;
    }
   



}

//调整3dtileset的坐标和方向
export const AdjustModel = function (tileset, params) {
    //旋转
    let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
    let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
    let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
    let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
    let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
    let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
    //平移
    let position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
    let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    //旋转、平移矩阵相乘
    Cesium.Matrix4.multiply(m, rotationX, m);
    Cesium.Matrix4.multiply(m, rotationY, m);
    Cesium.Matrix4.multiply(m, rotationZ, m);
    //赋值给tileset
    tileset._root.transform = m;
    // window.boundingSphere = tileset.boundingSphere;
}

//添加裁剪平面 glb
 export const tailorface = function (obj) {
    if (window.clippingPlanes == null) clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [
            new Cesium.ClippingPlane(
                new Cesium.Cartesian3(0.0, 0.0, -1.0),
                0.0
            ),
        ],
        edgeWidth: 0.0, //沿边
    });
    if (obj.entity != null) {
        obj.entity.model.clippingPlanes = clippingPlanes;
        // window.viewer.trackedEntity = obj.entity;

        const position = Cesium.Cartesian3.fromDegrees(
            parseFloat(114.74943), parseFloat(33.5502), parseFloat(50));
        for (let i = 0; i < clippingPlanes.length; ++i) {
            const plane = clippingPlanes.get(i);
            const planeEntity = viewer.entities.add({
                id: 'tailorface',
                position: position,
                plane: {
                    dimensions: new Cesium.Cartesian2(350.0, 420.0),
                    material: Cesium.Color.WHITE.withAlpha(0.1),
                    plane: new Cesium.CallbackProperty(
                        createPlaneUpdateFunction(plane),
                        false
                    ),
                    outline: true,
                    outlineColor: Cesium.Color.WHITE,
                },
            });
            planeEntities.push(planeEntity);
        }

        // Select plane when mouse down
        const downHandler = new Cesium.ScreenSpaceEventHandler(
            viewer.scene.canvas
        );
        downHandler.setInputAction(function (movement) {
            const pickedObject = viewer.scene.pick(movement.position);
            if (
                Cesium.defined(pickedObject) &&
                Cesium.defined(pickedObject.id) &&
                Cesium.defined(pickedObject.id.plane)
            ) {
                window.selectedPlane = pickedObject.id.plane;
                window.selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05);
                window.selectedPlane.outlineColor = Cesium.Color.WHITE;
                viewer.scene.screenSpaceCameraController.enableInputs = false;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        window.moveHandler.push({
            handler: downHandler,
            type: 'LEFT_DOWN'
        });

        // Release plane on mouse up
        const upHandler = new Cesium.ScreenSpaceEventHandler(
            viewer.scene.canvas
        );
        upHandler.setInputAction(function () {
            if (Cesium.defined(window.selectedPlane)) {
                window.selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
                window.selectedPlane.outlineColor = Cesium.Color.WHITE;
                window.selectedPlane = undefined;
            }
            viewer.scene.screenSpaceCameraController.enableInputs = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
        window.moveHandler.push({
            handler: upHandler,
            type: 'LEFT_UP'
        });

        // Update plane on mouse move
        const moveHandler = new Cesium.ScreenSpaceEventHandler(
            viewer.scene.canvas
        );
        moveHandler.setInputAction(function (movement) {
            if (Cesium.defined(window.selectedPlane)) {
                const deltaY = movement.startPosition.y - movement.endPosition.y;
                targetY += deltaY;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        window.moveHandler.push({
            handler: moveHandler,
            type: 'MOUSE_MOVE'
        });
    }
}

// 添加Cesium3DTileset裁剪平面
export const loadTileset=  function() {
    if (window.clippingPlanes == null) clippingPlanes = new Cesium.ClippingPlaneCollection({
    planes: [
      new Cesium.ClippingPlane(
        new Cesium.Cartesian3(0.0, 0.0, -1.0),
        0.0
      ),
    ],
    edgeWidth: 0.0, //沿边
  });

  if(window.tilesetModel!= null){
    window.tilesetModel.clippingPlanes=window.clippingPlanes
    const boundingSphere =   window.tilesetModel.boundingSphere;
   
      if (
        !Cesium.Matrix4.equals(
            window.tilesetModel.root.transform,
          Cesium.Matrix4.IDENTITY
        )
      ) {
        // The clipping plane is initially positioned at the tileset's root transform.
        // Apply an additional matrix to center the clipping plane on the bounding sphere center.
        const transformCenter = Cesium.Matrix4.getTranslation(
            window.tilesetModel.root.transform,
          new Cesium.Cartesian3()
        );
        const transformCartographic = Cesium.Cartographic.fromCartesian(
          transformCenter
        );
        const boundingSphereCartographic = Cesium.Cartographic.fromCartesian(
            window.tilesetModel.boundingSphere.center
        );
        const height =boundingSphereCartographic.height - transformCartographic.height;
        clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(
          new Cesium.Cartesian3(0.0, 0.0, height)
        );
      }
      
      const position = Cesium.Cartesian3.fromDegrees(
        parseFloat(114.74943), parseFloat(33.5502), parseFloat(50));

      for (let i = 0; i < clippingPlanes.length; ++i) {
        const plane = clippingPlanes.get(i);
        const planeEntity = viewer.entities.add({
          id: 'loadTileset_tailorface',
          position: boundingSphere.center,
          plane: {
            dimensions: new Cesium.Cartesian2(350.0, 420.0),
            material: Cesium.Color.WHITE.withAlpha(0.0),
            plane: new Cesium.CallbackProperty(
              createPlaneUpdateFunction(plane),
              false
            ),
            outline: false,
            // outlineColor: Cesium.Color.WHITE,
          },
        });

        planeEntities.push(planeEntity);
      }

    }
}

//移除裁剪平面
export const removetailorface = function () {
    window.clippingPlanes = null;
    viewer.entities.getById("nuantong").model.clippingPlanes = undefined;
    for (let i = 0; i < window.moveHandler.length; i++) {
        const element = window.moveHandler[i];
        if (element.type == 'LEFT_DOWN') {
            element.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        } else if (element.type == 'LEFT_UP') {
            element.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)
        } else if (element.type == 'MOUSE_MOVE') {
            element.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        };
        window.moveHandler.splice(i, 1);
        i--;
    }
    viewer.entities.removeById('tailorface');//清楚剖面 
    viewer.entities.removeById('loadTileset_tailorface');//清楚剖面loadTileset
    window.targetY=80;
}


//平面更新
export const createPlaneUpdateFunction = function (plane) {
    return function () {
        plane.distance = window.targetY;
        return plane;
    };
}

//添加 3dtileset 鼠标点击事件
export const addjsonHandler = function (_this) {
    //支持轮廓
    if (window.silhouetteBlue == null) window.silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
    silhouetteBlue.uniforms.length = 0.01;
    silhouetteBlue.selected = [];

    if (window.silhouetteGreen == null) window.silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteGreen.uniforms.color = Cesium.Color.LIME;
    silhouetteGreen.uniforms.length = 0.01;
    silhouetteGreen.selected = [];

    if (window.outline) {
        viewer.scene.postProcessStages.add(
            Cesium.PostProcessStageLibrary.createSilhouetteStage([
                silhouetteBlue,
                silhouetteGreen,
            ])
        );
        window.outline = false;
    }

    if (window.jsonHandler == null) {
        window.jsonHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        window.jsonHandler.setInputAction(function (clickEvent) {
            window.silhouetteGreen.selected = [];
            var pickedFeature = viewer.scene.pick(clickEvent.position);
            console.log(pickedFeature)
            if (!Cesium.defined(pickedFeature)) {
                window.document.getElementById("springframe").style.visibility = "hidden";
                return;
            }
            if (window.silhouetteGreen.selected[0] === pickedFeature) {
                return;
            }
            const highlightedFeature = window.silhouetteBlue.selected[0];
            if (pickedFeature === highlightedFeature) {
                window.silhouetteBlue.selected = [];
            }

            window.silhouetteGreen.selected = [pickedFeature];

            // let bubble = document.getElementById("springframe");
            // bubble.style.left = clickEvent.position.x + 10 + "px";
            // let divheight = bubble.offsetHeight;
            // let divy = clickEvent.position.y - divheight + 5;
            // bubble.style.bottom = divy + "px";
            // bubble.style.visibility = "visible";

            //获取点击的模型经纬度和高度
            let ellipsoid = viewer.scene.globe.ellipsoid;
            let cartesian = viewer.scene.pickPosition(clickEvent.position);
            window._cartesian = cartesian;
            if (cartesian) {
                var xyz = new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z);
                var wgs84 = ellipsoid.cartesianToCartographic(xyz);
                window._pm_position = {
                    x: Cesium.Math.toDegrees(wgs84.longitude),
                    y: Cesium.Math.toDegrees(wgs84.latitude),
                    h: wgs84.height
                }
            }

            //每帧渲染结束监听
            // viewer.scene.postRender.addEventListener(eventListener);

            var pick = viewer.scene.pick(clickEvent.position);
            window.text = pick;
            let pickId = pick.pickId.key;

            let propertyName = pick.getProperty('name');
            let propertyNamestrip=propertyName.replace(' ', '');
             if(propertyNamestrip=="ZKZG.B1(H4)-1"){
                propertyNamestrip="ZXZG.B1(H4)-1"
             }else if(propertyNamestrip=="ZKZG.B1(H4)-2"){
                      propertyNamestrip="ZXZG.B1(H4)-2"
             }else if(propertyNamestrip=="ZKZG.B1-(H30)-2"){
                      propertyNamestrip="ZXZG.B1-(H30)-2"
             }else if( propertyNamestrip=="ZKZG.B1(H30)-1"){
                     propertyNamestrip="ZXZG.B1(H30)-1"
             }else if( propertyNamestrip=="SF.B1(H13)-1"){
                propertyNamestrip="PF.B1(H13)-1" 
             }
            _this.$refs.child.openUnit(propertyNamestrip);

            console.log(propertyName);
            // window.document.getElementById("pickId").innerHTML = pickId == '' ? '无信息' : pickId;
            // window.document.getElementById("pickName").innerHTML = propertyName == '' ? '无信息' : propertyName;

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    if (window.jsonmoveHandler == null) {
        // Silhouette a feature blue on hover.
        window.jsonmoveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        window.jsonmoveHandler.setInputAction(function (clickEvent) {
            window.silhouetteBlue.selected = [];
            const pickedFeature = viewer.scene.pick(clickEvent.endPosition);
            // Highlight the feature if it's not already selected.
            if (pickedFeature !== window.selected.feature) {
                window.silhouetteBlue.selected = [pickedFeature];
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
}


//每帧渲染结束监听
export const eventListener = function () {
    let springframe_ = window.document.getElementById("springframe");
    var canvasHeight = viewer.scene.canvas.height;
    var windowPosition = new Cesium.Cartesian2();
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene,
    Cesium.Cartesian3.fromDegrees(window._pm_position.x, window._pm_position.y, window._pm_position.h), windowPosition);
    springframe_.style.bottom = (canvasHeight - windowPosition.y + 0) + 'px';
    springframe_.style.left = (windowPosition.x + 0) + 'px';
    springframe_.style.visibility = "visible";
}

//移除监听
export const removeeventListener = function () {
    viewer.scene.postRender.removeEventListener(eventListener);
}

//移除 3dtileset 鼠标点击事件
export const removejsonHandler = function () {
    if (window.jsonHandler != null) {
        window.jsonHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        window.jsonHandler = null;
    }
    if (window.jsonmoveHandler != null) {
        window.jsonmoveHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        window.jsonmoveHandler = null;
    }
}

//键盘按下事件
let flags = null //声明null变量

//键盘驱动行走
export const keyboardfly=function(){

    //console.log("进入键盘驱动漫游")
	
	var scene = viewer.scene
	var canvas = viewer.canvas
	var camera = viewer.camera
	canvas.setAttribute('tabindex', '0') // 将焦点放在画布上
	//如果点击就获取画布焦点
	canvas.onclick = function() {
		canvas.focus()
	}
	var ellipsoid = scene.globe.ellipsoid

	// 禁用默认的相机操作模式
	scene.screenSpaceCameraController.enableRotate = false //如果为 true，则允许用户旋转转换用户位置的世界
	scene.screenSpaceCameraController.enableTranslate = false //如果为 true，则允许用户平移地图
	scene.screenSpaceCameraController.enableZoom = false //如果为 true，则允许用户放大和缩小
	scene.screenSpaceCameraController.enableTilt = false //如果为 true，则允许用户倾斜相机
	scene.screenSpaceCameraController.enableLook = false //如果为 true，则允许用户使用自由外观

	//设置相机漫游的标记
	flags = {
		moveForward: false, // 是否向前移动
		moveBackward: false, // 是否向后移动
		moveUp: false, // 是否向上移动
		moveDown: false, // 是否向下移动
		moveLeft: false, // 是否向左移动
		moveRight: false, // 是否向右移动
		startPosition: null, // 鼠标指针开始移动位置
		endPosition: null, // 鼠标指针停止移动位置

		lookUp: false, //↑
		lookDown: false, //↓
		lookLeft: false, //←
		lookRight: false, //→
	}

	// 键盘按下监听
	document.addEventListener('keydown', keyDown, false)
	// 键盘弹起监听
	document.addEventListener('keyup', keyUp, false)
	// 对onTick事件进行监听
	viewer.clock.onTick.addEventListener(function() {
		// 获取实例的相机对象
		var camera = viewer.camera
		// 镜头转向系数，系数越大约灵敏，此处取0.1比较适中
		var lookFactor = 0.05
		// 根据高度来决定镜头移动的速度
		var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height
		var moveRate = cameraHeight / 1000.0

		if (flags.moveForward) {
			camera.moveForward(moveRate)
		}
		if (flags.moveBackward) {
			camera.moveBackward(moveRate)
		}
		if (flags.moveUp) {
			camera.moveUp(moveRate)
		}
		if (flags.moveDown) {
			camera.moveDown(moveRate)
		}
		if (flags.moveLeft) {
			camera.moveLeft(moveRate)
		}
		if (flags.moveRight) {
			camera.moveRight(moveRate)
		}
		if (flags.lookUp) {
			camera.lookUp(0.01 * lookFactor)
		}
		if (flags.lookDown) {
			camera.lookDown(0.01 * lookFactor)
		}
		if (flags.lookLeft) {
			camera.lookLeft(0.01 * lookFactor)
		}
		if (flags.lookRight) {
			camera.lookRight(0.01 * lookFactor)
		}
	})

}


//取消键盘驱动
export const deletekeyboardfly = function() {
	console.log('取消键盘驱动漫游')
	var scene = viewer.scene
	// 2.移除键盘监听事件
	document.removeEventListener('keydown', keyDown, false)
	document.removeEventListener('keyup', keyUp, false)
	scene.screenSpaceCameraController.enableRotate = true //如果为 true，则允许用户旋转转换用户位置的世界
	scene.screenSpaceCameraController.enableTranslate = true //如果为 true，则允许用户平移地图
	scene.screenSpaceCameraController.enableZoom = true //如果为 true，则允许用户放大和缩小
	scene.screenSpaceCameraController.enableTilt = true //如果为 true，则允许用户倾斜相机
	scene.screenSpaceCameraController.enableLook = true //如果为 true，则允许用户使用自由外观
}


//鼠标按下
export const keyDown =function(event) {
	let flagName = getFlagFromKeyCode(event.keyCode)
	if (typeof flagName !== 'undefined') {
		flags[flagName] = true
		event.preventDefault() //取消滚动条默认行为
	}
}


//键盘弹起事件
export const keyUp=function(event) {
	let flagName = getFlagFromKeyCode(event.keyCode)
	if (typeof flagName !== 'undefined') {
		flags[flagName] = false
		event.preventDefault() //取消滚动条默认行为
	}
}


//从键盘码获取flag标记
export const getFlagFromKeyCode=function(keyCode) {
	switch (keyCode) {
		case 87:
			return 'moveForward'
		case 83:
			return 'moveBackward'
		case 81:
			return 'moveUp'
		case 69:
			return 'moveDown'
		case 68:
			return 'moveRight'
		case 65:
			return 'moveLeft'
		case 38:
			return 'lookUp'
		case 40:
			return 'lookDown'
		case 37:
			return 'lookLeft'
		case 39:
			return 'lookRight'

		default:
			return undefined
	}
}


//上下左右键盘移动  模型
// 主体
// -90
// let x=114.74920544836898;
// let y=33.54999093172534;
// 90
let x=114.748685448368823;
let y=33.54990093172531;

// B1
// let x= 114.74885044836877 //模型中心X轴坐标(经度，单位：十进制度)
// let y= 33.54986093172531 //模型中心Y轴坐标(纬度，单位：十进制度)
//F1
// let x= 114.749185448368823 //模型中心X轴坐标(经度，单位：十进制度)
// let y= 33.55021993172531 //模型中心Y轴坐标(纬度，单位：十进制度)
//1-7
// let x= 114.74852044836867 //模型中心X轴坐标(经度，单位：十进制度)
// let y= 33.55072593172559 //模型中心Y轴坐标(纬度，单位：十进制度)
let z=49

// 监听键盘
export const  keyDownset=function() {
    document.onkeydown = (e) => {
      //事件对象兼容
      
      let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
      //键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40

      //左
      if (e1 && e1.keyCode == 37) {
        
        x=x-0.000005
        // x=x-0.000002
        console.log("x=="+x);
        // 按下左箭头
      } else if (e1 && e1.keyCode == 39) {
        x=x+0.000005
        // x=x+0.000002
        console.log("x=="+x);
        // 按下右箭头
      }else if(e1 && e1.keyCode == 38){
        y=y+0.000005
        // y=y+0.000002
        console.log("y=="+y);
      }else if(e1 && e1.keyCode == 40){
        y=y-0.000005
        // y=y-0.000002
        console.log("y=="+y);
      }else if(e1 && e1.keyCode == 87){
        z=z+0.1
        // z=z+1
        console.log("z=="+z);
      }
      else if(e1 && e1.keyCode == 83){
        z=z-0.1
        // z=z-1
        console.log("z=="+z);
      }
    
    if(window.mod!=null && window.mod!=undefined){
        window.viewer.scene.primitives.remove(mod)//移除模型
    }
        window.mod = new Cesium.Cesium3DTileset({
            url: "http://127.0.0.1:88/ZK/1-1/tileset.json",
            // url: "http://127.0.0.1:88/ZK/F1/tileset.json",
            // url: "http://127.0.0.1:88/ZK/1-8/tileset.json",
        });

        window.mod.readyPromise.then(function (mod) {
            let params={
                tx: x, //模型中心X轴坐标(经度，单位：十进制度)
                ty: y, //模型中心Y轴坐标(纬度，单位：十进制度)
                tz: z, //模型中心Z轴坐标(高程，单位：米)
                rx: 0, //X轴（经度）方向旋转角度(单位：度)
                ry: 0, //Y轴（纬度）方向旋转角度(单位：度)
                rz: 90, //Z轴（高程）方向旋转角度(单位：度)
                show: true,
            }
            window.viewer.scene.primitives.add(window.mod)
            let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
            let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
            let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
            let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
            let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
            let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
            //平移
            let position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
            let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
            //旋转、平移矩阵相乘
            Cesium.Matrix4.multiply(m, rotationX, m);
            Cesium.Matrix4.multiply(m, rotationY, m);
            Cesium.Matrix4.multiply(m, rotationZ, m);
            //赋值给tileset
            window.mod._root.transform = m;
            //贴地显示
        
        })
   }
}




export const getFlagKeyCode=function(keyCode) {
	switch (keyCode) {
		case 38:
			return 'lookUp'
		case 40:
			return 'lookDown'
		case 37:
			return 'lookLeft'
		case 39:
			return 'lookRight'

		default:
			return undefined
	}
}



