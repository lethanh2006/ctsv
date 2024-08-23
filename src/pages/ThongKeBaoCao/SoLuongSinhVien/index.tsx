
import { Card } from 'antd';

import SoLuongSinhVienLhc from './SoLuongSinhVienLhc';

const ThongKeSoLuongSinhVienPage = () => {

	return (
		<Card title='Thống kê số lượng sinh viên'>
			<div style={{ marginBottom: 12 }}>
				Thống kê số lượng sinh viên bị cảnh báo học tập, buộc thôi học; bảo lưu, thôi học theo từng ngành qua các kỳ học
			</div>
			<SoLuongSinhVienLhc />
		</Card>
	);
};

export default ThongKeSoLuongSinhVienPage;
