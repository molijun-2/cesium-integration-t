export const routes = [
    {
        path: '/',
        name: 'main',
        component: () => import("@/views/main/index.vue"),
        children: [
            {
                path: "/cesiumActualCombat/cesiumActualCombatCaseOne/arbitraryColor",
                name: "arbitraryColor",
                component: () => import("@/views/main/cesiumActualCombat/cesiumActualCombatCaseOne/arbitraryColor/index.vue"),
            },
        ]
    }
]