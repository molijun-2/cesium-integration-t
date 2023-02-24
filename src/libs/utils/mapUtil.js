import { Viewer } from "cesium";

//cesium 飞行
export const fly = function (lon, lat, h, heading, pitch, roll, duration) {
    var center = window.Cesium.Cartesian3.fromDegrees(lon, lat, h);
    window.viewer?.camera.flyTo({
        destination: center,
        orientation: {
            heading: parseFloat(heading),//
            pitch: parseFloat(pitch),
            roll: parseFloat(roll)
        },
        duration: duration
    });
}
export const setView = () => {
    window.viewer?.camera.setView({
        destination: window.Cesium.Cartesian3.fromDegrees(114.141459, 22.509495, 61118),
        orientation: {
            heading: window.Cesium.Math.toRadians(3.7),//角度转换为弧度
            pitch: window.Cesium.Math.toRadians(-80),
            roll: window.Cesium.Math.toRadians(360)
        }
    });
}
