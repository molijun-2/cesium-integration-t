export default {
    firstMenus: [
        {
            name: 'CESIUM编程入门',
            value: 'cesiumPlc'
        },
        {
            name: 'CESIUM编程中级',
            value: 'cesiumProgrammingIntermediate'
        },
        {
            name: 'CESIUM实战',
            value: 'cesiumActualCombat',
        },
        {
            name: 'CESIUM数据',
            value: 'cesiumData',
        },
        {
            name: 'WEBGL着色器',
            value: 'webglShader'
        },
        {
            name: 'API文档',
            value: 'apiDocument'
        },
        {
            name: '关于',
            value: 'inRegardTo'
        },
        {
            name: '工具',
            value: 'tool'
        }
    ],
    twoMenus: {
        cesiumPlc: [
            {
                name: 'cesium编程入门（一）cesium简介',
                value: 'cesiumPlcOne',
                path: '/cesiumPlc/cesiumPlcOne'
            },
            {
                name: 'cesium编程入门（二）环境搭建',
                value: 'cesiumPlcTwo',
                path: '/cesiumPlc/cesiumPlcTwo'
            }
        ],
        cesiumActualCombat: [
            {
                name: '实战案例集一',
                value: 'cesiumActualCombatCaseOne',
            },
            {
                name: '实战案例集二',
                value: 'cesiumActualCombatCaseTwo',
            }
        ]
    },
    threeMenus: {
        cesiumActualCombatCaseOne: [
            {
                name: 'Animation主题',
                value: 'animation',
                path: '/cesiumActualCombat/cesiumActualCombatCaseOne/animation',
            },
            {
                name: '不同精度DEM合并',
                value: 'dem',
                path: '/cesiumActualCombat/cesiumActualCombatCaseOne/dem',
            },
            {
                name: '设置地球颜色为任意颜色',
                value: 'arbitraryColor',
                path: '/cesiumActualCombat/cesiumActualCombatCaseOne/arbitraryColor',
            }
        ],
        cesiumActualCombatCaseTwo: [
            {
                name: '限制底图范围',
                value: 'baseMapRange',
                path: '/cesiumActualCombat/cesiumActualCombatCaseTwo/baseMapRange',
            }
        ]
    }
}