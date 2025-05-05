import ViewChiTietLopHp from '@/pages/DaoTaoV2/HocKy/LopHocPhan/components/ViewChiTiet';
import { Modal, Spin } from 'antd';
import { useModel } from 'umi';

const ModalChiTietLichHocSinhVien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { loading } = useModel('daotaov2.hocky.lophocphan');
	const { visible, setVisible } = props;

	return (
		<Modal
			visible={visible}
			title='Thông tin lớp tín chỉ'
			destroyOnClose
			width={800}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
		>
			<Spin spinning={loading}>
				<ViewChiTietLopHp />
			</Spin>
		</Modal>
	);
};

export default ModalChiTietLichHocSinhVien;
