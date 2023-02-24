<template>
    <div class="testo-root-view">
        <header class="root-header">
            {{ developT }}
        </header>
        <div class="root-menu">
            <menusGather></menusGather>
        </div>
        <div class="root-content">
            <div class="right-contaner">
                <router-view></router-view>
            </div>
            <div class="map-contaner">
                <CesiumGather></CesiumGather>
                <CesiumCanvasLayers></CesiumCanvasLayers>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import getGlobalVariable from '@/hooks/globalVariableHooks.js'
const developT = import.meta.env.VITE_TEST
const { router } = getGlobalVariable()
const headerBack = ref('url("/images/main/qianli.png")')

onMounted(() => {
    initMap()
})
const initMap = () => {
    document.onkeydown = function (e) {
        if (e.ctrlKey) {
            e.preventDefault()
            headerBack.value = 'url("/images/main/qianli.png")'
        }
        if (e.keyCode == 18) {
            headerBack.value = 'url("/images/main/moxiaoniu.png")'
        }
    }
}





</script>
<style lang="less" scoped>
.testo-root-view {
    width: 100%;
    height: 100%;
    background: url(/images/main/rootBg.png) no-repeat;
    background-size: 100% 100%;
    color: #fff;
    font-size: 16px;
    overflow: hidden;
}

.root-header {
    width: 100%;
    height: 72px;
    display: flex;
    justify-content: center;
    align-items: center;
    // background: v-bind(headerBack) no-repeat;
    background-size: 100% 100%;
}

.root-menu {
    margin: 8px 0;
    display: flex;
    width: 100%;
    justify-content: center;
}

.root-content {
    display: flex;
    flex: 1;
    height: 100%;



    .map-contaner {
        flex: 0.8;
        // flex: 1;
        background-color: aliceblue;
    }

    .right-contaner {
    flex: 0.2;
    }
}
</style>