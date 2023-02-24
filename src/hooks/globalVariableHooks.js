import $bus from '@/libs/utils/bus.js'
import { useRouter } from 'vue-router'
export default function getGlobalVariable() {
    const router = useRouter()
    return {
        router,
        $bus
    }
}
