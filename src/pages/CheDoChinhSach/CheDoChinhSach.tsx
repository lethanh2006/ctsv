import { useModel } from 'umi';
import QuyetDinh from './ QuyetDinh';
import { useEffect } from 'react';
import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';

const CheDoChinhSach = () => {
	const { getModel, setDanhSach, setRecord, danhSach } = useModel('chedochinhsach');
	const { setDanhSach: setDanhSachQuyetDinh } = useModel('quyetdinhchedosinhvien');
	useEffect(() => {
		getModel({ loaiCheDoSinhVien: ELoaiCheDoSinhVien.CHE_DO_CHINH_SACH });
		return () => {
			setRecord(undefined);
			setDanhSach([]);
		};
	}, []);

	useEffect(() => {
		if (danhSach.length) setRecord(danhSach[0]);
		else setDanhSachQuyetDinh([]);
	}, [danhSach.map((item) => item.ten)]);

	return <QuyetDinh title='Danh sách sinh viên hưởng chế độ chính sách' />;
};

export default CheDoChinhSach;
