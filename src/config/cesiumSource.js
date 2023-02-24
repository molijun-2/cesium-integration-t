import {
    Viewer,
    Credit,
    Math,
    GeographicTilingScheme,
    WebMercatorTilingScheme,Rectangle
} from 'cesium'
export default {
    /**
     * 天地图
     * WebMapTileServiceImageryProvider 提供由 WMTS 1.0.0 兼容服务器提供的平铺图像。该提供程序支持HTTP KVP编码和RESTful GetTile请求，但尚不支持SOAP编码。
     */
    tianditu: [
        {
            // iconImageUrl: 'img_c.jpg',
            name: '天地图影像底图',
            options: {
                url: 'https://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=feff991159823907566acaa7273472ea',
                layer: 'img',
                style: 'default',
                format: 'tiles',
                tileMatrixSetID: 'c',
                tileMatrixLabels: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                ],
                tilingScheme: new GeographicTilingScheme(),//与TileMatrixSet中的拼贴组织相对应的拼贴方案。
                credit: new Credit('天地图全球影像服务'),//数据源的信用，显示在画布上。
                subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                maximumLevel: 18,
                show: true,
            },
            providerName: 'WebMapTileServiceImageryProvider',
        },
        {
            iconImageUrl: 'cia_c.png',
            name: '天地图影像注记',
            options: {
                url: 'https://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=feff991159823907566acaa7273472ea',
                layer: 'img',
                style: 'default',
                format: 'tiles',
                tileMatrixSetID: 'c',
                tileMatrixLabels: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                ],
                tilingScheme: new GeographicTilingScheme(),
                credit: new Credit('天地图全球影像服务'),
                subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                maximumLevel: 18,
                show: true,
            },
            providerName: 'WebMapTileServiceImageryProvider',
        },
        {
            iconImageUrl: 'vec_c.jpg',
            name: '天地图矢量底图',
            options: {
                url: 'https://{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=feff991159823907566acaa7273472ea',
                layer: 'vec',
                style: 'default',
                format: 'image/jpeg',
                tileMatrixSetID: 'c',
                tileMatrixLabels: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                ],
                tilingScheme: new GeographicTilingScheme(),
                credit: new Credit('天地图全球影像服务'),
                subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                maximumLevel: 18,
                show: true,
            },
            providerName: 'WebMapTileServiceImageryProvider',
        },
        {
            iconImageUrl: 'cva_c.png',
            name: '天地图矢量注记',
            options: {
                url: 'https://{s}.tianditu.gov.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=feff991159823907566acaa7273472ea',
                layer: 'vec',
                style: 'default',
                format: 'image/jpeg',
                tileMatrixSetID: 'c',
                tileMatrixLabels: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                ],
                tilingScheme: new GeographicTilingScheme(),
                credit: new Credit('天地图全球影像服务'),
                subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                maximumLevel: 18,
                show: true,
            },
            providerName: 'WebMapTileServiceImageryProvider',
        },
    ],
    /**
     * 高德
     * UrlTemplateImageryProvider 通过使用指定的URL模板请求图块来提供图像。
     */
    gaode: [
        {
            iconImageUrl: 'amap_img.png',
            name: '高德影像底图',
            options: {
                url: 'https://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                subdomains: ['01', '02', '03', '04'],
            },
            providerName: 'UrlTemplateImageryProvider',
            // coordinateType: CoordinateType.Gcj02,
        },
        {
            iconImageUrl: 'amap_img.png',
            name: '高德影像注记',
            options: {
                url: 'https://webst{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
                subdomains: ['01', '02', '03', '04'],
            },
            providerName: 'UrlTemplateImageryProvider',
            // coordinateType: CoordinateType.Gcj02,
        },
        {
            iconImageUrl: 'amap_img.png',
            name: '高德矢量',
            options: {
                url: 'https://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                subdomains: ['01', '02', '03', '04'],
            },
            providerName: 'UrlTemplateImageryProvider',
            // coordinateType: CoordinateType.Gcj02,
        },
    ],
    // google
    google: [
        {
            iconImageUrl: 'google_hybrid.jpg',
            name: 'google混合',
            options: {
                url: 'https://mt1.google.cn/vt/lyrs=y&hl=zh-CN&x={x}&y={y}&z={z}',
            },
            providerName: 'UrlTemplateImageryProvider',
        },
        {
            iconImageUrl: 'google_satellite.jpg',
            name: 'google影像',
            options: {
                url: 'https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}',
            },
            providerName: 'UrlTemplateImageryProvider',
        },
        {
            iconImageUrl: 'google_label.png',
            name: 'google注记',
            options: {
                url: 'https://mt1.google.cn/vt/lyrs=h&hl=zh-CN&x={x}&y={y}&z={z}',
            },
            providerName: 'UrlTemplateImageryProvider',
        },
        {
            iconImageUrl: 'google_road.jpg',
            name: 'google道路',
            options: {
                url: 'https://mt1.google.com/vt/lyrs=m&hl=zh-CN&x={x}&y={y}&z={z}',
            },
            providerName: 'UrlTemplateImageryProvider',
        },
        {
            iconImageUrl: 'google_terrain.jpg',
            name: 'google地形',
            options: {
                url: 'https://mt1.google.com/vt/lyrs=p&hl=zh-CN&x={x}&y={y}&z={z}',
            },
            providerName: 'UrlTemplateImageryProvider',
        },
    ],
    /**
     * WGS_Mercator
     * new Cesium.TileCoordinatesImageryProvider ( options )Scene/TileCoordinatesImageryProvider.js 36
        ImageryProvider ，它在切片方案中的每个渲染图块周围绘制一个框，并绘制其中的标签指示图块的X，Y，Level坐标。这主要用于调试地形和图像渲染问题。
     */
    WGS_Mercator: [
        {
            iconImageUrl: 'tile_coordinates.jpg',
            name: 'WGS84切片网',
            providerName: 'TileCoordinatesImageryProvider',
        },
        {
            iconImageUrl: 'tile_coordinates.jpg',
            name: 'Web Mercator切片网',
            options: {
                tilingScheme: new WebMercatorTilingScheme(),
            },
            providerName: 'TileCoordinatesImageryProvider',
        },
        {
            iconImageUrl: 'tile.jpg',
            name: 'Web Mercator网',
            options: {
                tilingScheme: new WebMercatorTilingScheme(),
            },
            providerName: 'GridImageryProvider',
            // 一个 ImageryProvider ，它在每个具有可控制背景和辉光的图块上绘制线框网格。对于自定义渲染效果或调试地形可能很有用。
        },
        {
            iconImageUrl: 'tile.jpg',
            name: 'WGS84网',
            providerName: 'GridImageryProvider',
        },
    ],
    /**
     * arcgis
     * 查看更多arcgis服务：https://map.geoq.cn/arcgis/rest/services
     * ArcGisMapServerImageryProvider 提供由ArcGIS MapServer托管的平铺图像。默认情况下，服务器的预缓存磁贴为使用（如果有）。
     */
    arcgis: [
        {
            // iconImageUrl: 'google_satellite.jpg',
            name: 'arcgis',
            options: {
                //蓝黑色中文不含兴趣点版中国基础地图
                // url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/",
                // 彩色中文不含兴趣点版中国基础地图
                url:'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity_Mobile/MapServer'
            },
            providerName: 'ArcGisMapServerImageryProvider',
        },
    ],
    /**
     * 易图
     */
    yitu:[
        {
            name: '易图浅色电子地图-1',
            minimumLevel: 6,
            maximumLevel: 18,
            rectangle: Rectangle.fromDegrees(
              113.3128601285094845,
              22.1252674833091554,
              115.70955944993392,
              23.1508516579385777
            ),
            options: {
                url: 'http://tiles.szetop.cn:8100/tiles/gzj/map/{z}/{x}/{y}.png',
                subdomains: ['01', '02', '03', '04'],
            },
            providerName: 'UrlTemplateImageryProvider',
            // coordinateType: CoordinateType.Gcj02,
        },
    ]
}