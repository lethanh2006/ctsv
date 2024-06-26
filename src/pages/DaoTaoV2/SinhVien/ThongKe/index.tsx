import { Card, Collapse } from 'antd';
import ThongKeDanToc from './DanToc';
import SelectHocKy from '../../HocKy/HocKy/components/SelectHocKy';
import { useModel } from 'umi';
import ThongKeTonGiao from './TonGiao';
import ThongKeNganh from './Nganh';
import ThongKeHoKhau from './HoKhau';

const ThongKeSinhVien = () => {
	const { record: recHocKy, setRecord: setRecHocKy, danhSach } = useModel('daotaov2.hocky.hocky');

	return (
		<Card title='Thống kê sinh viên'>
			<SelectHocKy
				style={{ width: 300, marginBottom: 8 }}
				value={recHocKy?._id}
				onChange={(val) => setRecHocKy(danhSach.find((item) => item._id === val))}
				isSetRecord
			/>
			<Collapse>
				<Collapse.Panel header='Thống kê sinh viên theo dân tộc' key={'dantoc'}>
					<ThongKeDanToc />
				</Collapse.Panel>
				<Collapse.Panel header='Thống kê sinh viên theo tôn giáo' key={'tongiao'}>
					<ThongKeTonGiao />
				</Collapse.Panel>
				<Collapse.Panel header='Thống kê sinh viên theo ngành' key={'nganh'}>
					<ThongKeNganh />
				</Collapse.Panel>
				<Collapse.Panel header='Thống kê sinh viên theo hộ khẩu' key={'hokhau'}>
					<ThongKeHoKhau />
				</Collapse.Panel>
			</Collapse>
		</Card>
	);
};

export default ThongKeSinhVien;
