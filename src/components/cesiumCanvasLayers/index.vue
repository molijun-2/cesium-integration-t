<template></template>
<script setup >
import { onMounted } from 'vue';
import cesiumSource from '@/config/cesiumSource.js';
import { setView } from '@/libs/utils/mapUtil.js';
onMounted(() => {
    init()
})
const init = () => {
    const im = window?.viewer?.cesiumCommonface?.imageryManager
    if (!im) {
        return
    }
    // im.addImagery(cesiumSource['gaode'][0])
    // im.addImagery(cesiumSource['gaode'][1])
    im.addImagery(cesiumSource['tianditu'][0])
    // im.addImagery(cesiumSource['tianditu'][1])
    // im.addImagery(cesiumSource['tianditu'][2])
    // im.addImagery(cesiumSource['tianditu'][3])

    // im.addImagery(cesiumSource['WGS_Mercator'][2])

    // im.addImagery(cesiumSource['arcgis'][0])
    // im.addImagery(cesiumSource['yitu'][0])

    setView()
    let tileUrl = 'http://tiles.szetop.cn:8100/FUTIAN_MASH/tileset.json'
    tileUrl = new Cesium.Resource({
        url: tileUrl
    })

    const tiles = new Cesium.Cesium3DTileset({
        url: tileUrl,
        maximumScreenSpaceError: 16,
        preferLeaves: true,
        skipLevelOfDetail: true, // 数值加大，能让最终成像变模糊
        baseScreenSpaceError: 512,
        skipLevels: 1,
        skipScreenSpaceErrorFactor: 16,
        loadSiblings: true,
        cullRequestsWhileMovingMultiplier: 0.01, // 值越小能够更快的剔除
        preloadWhenHidden: true,
        progressiveResolutionHeightFraction: 0.1, // 数值偏于0能够让初始加载变得模糊
        dynamicScreenSpaceErrorDensity: 500, // 数值加大，能让周边加载变快；动态误差在 [0.0, 1.0) 范围内，乘以dynamicScreenSpaceErrorFactor产生最终的动态误差。然后从图块的实际屏幕空间误差中减去该动态误差。
        dynamicScreenSpaceErrorFactor: 1,
        dynamicScreenSpaceError: true,
    })

    // viewer.scene.primitives.add(tiles)//add 向集合添加一个原语


}


</script>
<style></style>
