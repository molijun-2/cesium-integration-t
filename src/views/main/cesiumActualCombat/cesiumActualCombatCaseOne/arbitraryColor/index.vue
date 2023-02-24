<template>
    <div>
        铠甲勇士
        <a-button type="primary">Primary Button</a-button>
        <a-button>Default Button</a-button>
    </div>
</template>
<script setup>
 // 设置地球颜色为任意纯色--start
    // viewer.scene.skyAtmosphere.show = false//是否显示球边界
    // viewer.scene.globe.imageryLayers.get(0).alpha = 0.0;
    // viewer.scene.globe.baseColor = new Cesium.Color(0, 1, 0, 0); //默认为蓝色，这里改为绿色
    // viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#1e1e1e')

    // 设置为透明
    // viewer.scene.globe.showGroundAtmosphere = false;
    // viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;
    // viewer.scene.globe.translucency.enabled = true;//设置为true时，球体被渲染为半透明的表面
    // 颜色--end
</script>
<style lang='less' scoped></style>