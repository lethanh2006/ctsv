import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import FilterKhoaNganh from '@/pages/DaoTaoV2/NamHoc/KhoaNganh/components/Filter';
import { Card } from 'antd';
import KetQuaHocKyTablePage from './Table';

const KetQuaHocKyPage = () => {
	return (
		<Card title='Kết quả học tập xét học bổng'>
			<FilterKhoaNganh>
				<FilterHocKy hideExpand isSetHocKy allowClear />
			</FilterKhoaNganh>

			<KetQuaHocKyTablePage />
		</Card>
	);
};

export default KetQuaHocKyPage;
