import { Modal } from 'antd';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import LichHocLopHocPhanMulti from './Calendar/Multi';
import ModalChiTietLichHocSinhVien from './ModalChiTietLichHoc';

const ModalLichHocSinhVien = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	danhSachLop?: string[];
	tenSinhVien?: string;
}) => {
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const { visible, setVisible, danhSachLop, tenSinhVien = '' } = props;

	return (
		<Modal
			title={`Lịch học dự kiến của sinh viên ${tenSinhVien}`}
			visible={visible}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			width={1000}
		>
			{visible ? <LichHocLopHocPhanMulti danhSachLop={danhSachLop} onClickLop={() => setVisibleDetail(true)} /> : null}

			<ModalChiTietLichHocSinhVien visible={visibleDetail} setVisible={setVisibleDetail} />
		</Modal>
	);
};

export default ModalLichHocSinhVien;
