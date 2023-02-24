import ImageryManager from "./libs/imageryManager/imageryManager";
import * as Cesium from 'cesium'
export default class CesiumCommonface {
    constructor(viewer) {
        this.viewer = viewer
    }
    // 图层集合
     get imageryManager() {
        if (!this._imageryManager) {
            this._imageryManager = new ImageryManager(this.viewer)
        }
        return this._imageryManager
    }
}