import useInitModel from '@/hooks/useInitModel';
import { getAllHinhThucDaoTao, getLopHanhChinhAdmin } from '@/services/NamHoc/LopHanhChinh';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const objInit = useInitModel<LopHanhChinh.RecordAdmin>('odoo-lop-hanh-chinh');
  const { setDanhSach, setLoading, condition, setTotal, page, limit } = objInit;
  const [danhSachHinhThucDaoTao, setDanhSachHinhThucDaoTao] = useState<
    LopHanhChinh.HinhThucDaoTao[]
  >([]);
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<number>();
  const { setHinhThucDaoTao: setHinhThucDaoTaoLopTinChi, hinhThucDaoTao: hinhThucDaoTaoLopTinChi } =
    useModel('loptinchi');

  const getAllHinhThucDaoTaoModel = async (isSetRecord?: boolean) => {
    setLoading(true);
    const response = await getAllHinhThucDaoTao();
    setDanhSachHinhThucDaoTao(response?.data?.data ?? []);
    setLoading(false);
    if (isSetRecord === true && !hinhThucDaoTaoLopTinChi) {
      setHinhThucDaoTaoLopTinChi(response?.data?.data?.[0]?.id);
    }
  };

  const getLopHanhChinhAdminModel = async (payload?: { page: number; limit: number }) => {
    setLoading(true);
    const response = await getLopHanhChinhAdmin({
      page: payload ? payload.page : page,
      limit: payload ? payload.limit : limit,
      condition: {
        ...condition,
        hinh_thuc_dao_tao_id: hinhThucDaoTao,
      },
    });
    setTotal(response?.data?.data?.total ?? 0);
    setDanhSach(response?.data?.data?.result ?? []);
    setLoading(false);
  };

  return {
    ...objInit,
    getAllHinhThucDaoTaoModel,
    getLopHanhChinhAdminModel,
    danhSachHinhThucDaoTao,
    setDanhSachHinhThucDaoTao,
    hinhThucDaoTao,
    setHinhThucDaoTao,
  };
};
