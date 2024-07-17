import { PieChartOutlined, TableOutlined } from '@ant-design/icons';
import { Card, Collapse, Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectHocKy from '../../HocKy/HocKy/components/SelectHocKy';
import ThongKeDanToc from './DanToc';
import ThongKeHoKhau from './HoKhau';
import ThongKeNganh from './Nganh';
import ThongKeTonGiao from './TonGiao';

const ThongKeSinhVien = () => {
	const { record: recHocKy, setRecord: setRecHocKy, danhSach } = useModel('daotaov2.hocky.hocky');
	const [mode, setMode] = useState<'table' | 'donut'>('table');
	return (
		<Card title='Thống kê sinh viên'>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<SelectHocKy
					style={{ width: 300, marginBottom: 8 }}
					value={recHocKy?._id}
					onChange={(val) => setRecHocKy(danhSach.find((item) => item._id === val))}
					isSetRecord
				/>
				<Tabs onChange={(val: any) => setMode(val)}>
					<Tabs.TabPane key={'table'} tabKey='table' tab={<TableOutlined />} />
					<Tabs.TabPane key={'donut'} tabKey='donut' tab={<PieChartOutlined />} />
				</Tabs>
			</div>
			<Collapse>
				<Collapse.Panel header='Thống kê sinh viên theo dân tộc' key={'dantoc'}>
					<ThongKeDanToc mode={mode} />
				</Collapse.Panel>
				<Collapse.Panel header='Thống kê sinh viên theo tôn giáo' key={'tongiao'}>
					<ThongKeTonGiao mode={mode} />
				</Collapse.Panel>
				<Collapse.Panel header='Thống kê sinh viên theo ngành' key={'nganh'}>
					<ThongKeNganh mode={mode} />
				</Collapse.Panel>
				<Collapse.Panel header='Thống kê sinh viên theo hộ khẩu' key={'hokhau'}>
					<ThongKeHoKhau mode={mode} />
				</Collapse.Panel>
				{/* <Collapse.Panel header='Cố vấn học tập' key={'cvht'}>
					<CoVanHocTap mode={mode} />
				</Collapse.Panel> */}
			</Collapse>
		</Card>
	);
};

export default ThongKeSinhVien;
