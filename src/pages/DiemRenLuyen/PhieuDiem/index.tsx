import StepDotChamDiemRenLuyen from '@/pages/DiemRenLuyen/Dot/Step';
import DanhSachSinhVien from '@/pages/DiemRenLuyen/PhieuDiem/components/DanhSachSinhVien';
import { Card } from 'antd';

const PhieuDiemRenLuyen = (props: { idLop?: string }) => {
	const MainContent = (
		<>
			<div style={{ marginBottom: 12 }}>
				<StepDotChamDiemRenLuyen />
			</div>

			<DanhSachSinhVien idLop={props?.idLop} />
		</>
	);

	return (
		<>{props?.idLop ? MainContent : <Card title={'Danh sách khai báo phiếu điểm rèn luyện'}>{MainContent}</Card>}</>
	);
};
export default PhieuDiemRenLuyen;
