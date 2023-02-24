<template>
    <a-dropdown v-for="(item) in menuConfig.firstMenus" :key="item">
        <a class="ant-dropdown-link" @click.prevent>
            {{ item.name }}
        </a>
        <template #overlay v-if="menuConfig.twoMenus[item.value]">
            <a-menu>
                <div v-for="(item2_1) in menuConfig.twoMenus[item.value]" @click.stop="menuClick(item2_1)"
                    :key="item2_1.name">
                    <a-menu-item v-if="item2_1?.path">{{
                        item2_1.name
                    }}</a-menu-item>
                </div>
                <div v-for="(item2_2) in menuConfig.twoMenus[item.value]" :key="item2_2.name">
                    <a-sub-menu :key="item2_2.name" v-if="!(item2_2?.path)" :title="item2_2.name">
                        <a-menu-item v-for="item3 in menuConfig.threeMenus[item2_2.value]" @click.stop="menuClick(item3)">{{
                            item3.name
                        }}</a-menu-item>
                    </a-sub-menu>

                </div>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script setup>
import getGlobalVariable from '@/hooks/globalVariableHooks.js'
import menuConfig from '@/hooks/menuConfig.js'
const { router } = getGlobalVariable()
const menuClick = (item) => {
    if (item?.path) {
        router.push(item.path);
    }
}
</script>
<style lang="less" scoped>
.ant-dropdown-link {
    border: 0.00521rem solid rgba(84, 181, 255, .3);
    padding: 2px 20px;
    box-sizing: border-box;
    color: #54b5ff;
    margin-right: 35px;
    background-color: #09142c;
    min-width: 0.83333rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>