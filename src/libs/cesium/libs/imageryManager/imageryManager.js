import { Viewer, ImageryLayer } from 'cesium'
import * as Cesium from 'cesium'

export default class ImageryManager {
    
    constructor(viewer) {
        this.viewer = viewer
    }
     addImagery(source) {
        const provider = new (Cesium)[source.providerName]({ ...(source.options || {}) })
        // 暂时不知道用处 start......
        // provider.readyPromise.then((success: boolean): void => {
        //     if (source.coordinateType) {
        //         layer.coordinateTransform = new ImageryLayerCoordinateTransform(
        //             layer,
        //             source.coordinateType,
        //             true
        //         )
        //     }

        //     source.afterReady && source.afterReady(viewer, success)
        // })
        // 暂时不知道用处 end......
        const layer = new ImageryLayer(provider)
        layer.name = source.name
        this.viewer.imageryLayers.add(layer)
        return layer
    }
}