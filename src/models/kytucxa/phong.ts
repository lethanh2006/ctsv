import useInitModel from '@/hooks/useInitModel';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { ipCsvc } from '@/utils/ip';

export default () => {
    const objInit = useInitModel<KyTucXa.IPhongKyTucXa>('phong/ktx', undefined, undefined, ipCsvc);

    return {
        ...objInit,
    };
};
