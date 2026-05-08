import useInitModel from '@/hooks/useInitModel';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { ipCsvc } from '@/utils/ip';

export default () => {
    const objInit = useInitModel<KyTucXa.IDanhMucChung>(
        'danh-muc-chung',
        undefined,
        { maLoai: 'TIEN_ICH_PHONG' },
        ipCsvc
    );

    const getAllModel: typeof objInit.getAllModel = (isSetRecord, sortParam, conditionParam, ...rest) => {
        const finalCondition = {
            maLoai: 'TIEN_ICH_PHONG',
            ...(conditionParam || {}),
        };
        return objInit.getAllModel(isSetRecord, sortParam, finalCondition, ...rest);
    };

    return {
        ...objInit,
        getAllModel,
    };
};

