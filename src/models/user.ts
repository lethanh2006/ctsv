import useInitModel from '@/hooks/useInitModel';
import { adminChangePassword, getUser, getUserMetaDataFilter, putUser } from '@/services/User/user';
import { type Login } from '@/services/ant-design-pro/typings';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<Login.Profile>('odoo-user');
  const { setLoading, page, limit, condition, setDanhSach, setTotal, setVisibleForm } = objInit;
  const [danhSachNguoiDungCuThe, setDanhSachNguoiDungCuThe] = useState<User.NguoiDungCuThe[]>([]);
  const [vaiTro, setVaiTro] = useState<string>('sinh_vien');
  const [conditionNguoiDungCuThe, setConditionNguoiDungCuThe] = useState<any>({});
  const [visibleFormCapLaiMatKhau, setVisibleFormCapLaiMatKhau] = useState<boolean>(false);

  const getUserModel = async (payload?: {
    pageParam?: number;
    limitParam?: number;
    vaiTroParam?: string;
    containsThinhGiang?: boolean;
  }) => {
    setLoading(true);
    const response = await getUser({
      page: payload?.pageParam ?? page,
      limit: payload?.limitParam ?? limit,
      condition: {
        ...condition,
        vai_tro: payload?.vaiTroParam ?? vaiTro,
        containsThinhGiang: payload?.containsThinhGiang,
      },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const adminChangePasswordModel = async (payload: { user_id?: number; password: string }) => {
    if (!payload?.user_id) return;
    setLoading(true);
    await adminChangePassword(payload);
    message.success('Cấp lại mật khẩu thành công');
    setVisibleFormCapLaiMatKhau(false);
    setLoading(false);
  };

  const adminPutProfileUserModel = async (payload: Login.Profile & { partner_id: number }) => {
    if (!payload.partner_id) return;
    setLoading(true);
    await putUser(payload);
    message.success('Lưu thành công');
    setLoading(false);
    getUserModel();
    setVisibleForm(false);
  };

  const getUserMetaDataFilterModel = async (pageParam?: number, limitParam?: number) => {
    const response = await getUserMetaDataFilter(conditionNguoiDungCuThe, pageParam, limitParam);
    setDanhSachNguoiDungCuThe(response?.data?.data?.result ?? []);
  };

  return {
    ...objInit,
    vaiTro,
    setVaiTro,
    danhSachNguoiDungCuThe,
    setDanhSachNguoiDungCuThe,
    setConditionNguoiDungCuThe,
    conditionNguoiDungCuThe,
    getUserMetaDataFilterModel,
    visibleFormCapLaiMatKhau,
    setVisibleFormCapLaiMatKhau,
    adminPutProfileUserModel,
    adminChangePasswordModel,
    getUserModel,
  };
};
