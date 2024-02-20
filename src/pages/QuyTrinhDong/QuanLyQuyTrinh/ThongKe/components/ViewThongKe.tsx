import { getDataThongKeJson } from '@/services/QuyTrinhDong/ThongKe/thongke';
import { Button, Input, Spin, Tabs, Tooltip } from 'antd';
import ViewColumnThongKe from './ViewColumn';
import ViewDonutThongKe from './ViewDonut';
import ViewTableThongKe from './ViewTable';
import { useEffect, useState } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ELoaiFilterThongKe } from '@/services/QuyTrinhDong/ThongKe/constant';
import SelectDotKhaiBao from '../../components/DotKhaiBao/Select';
import { EOperatorType } from '@/components/Table/constant';

const ViewThongKe = (props: { idThongKe: string }) => {
	const { danhSach } = useModel('quytrinh.thongke');

	const [filters, setFilters] = useState<any[]>([]);

	const { record: recordQuyTrinh } = useModel('quytrinh.quanlyquytrinh');
	const recordThongKe = danhSach.find((item) => item._id === props.idThongKe);
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const getData = async () => {
		if (!props.idThongKe || !danhSach.map((item) => item._id).includes(props.idThongKe)) return;
		setLoading(true);
		const res = await getDataThongKeJson(props.idThongKe, { filters: filters });
		setData(res?.data?.data?.data ?? []);
		setLoading(false);
	};

	useEffect(() => {
		getData();
	}, [props.idThongKe, filters]);

	return (
		<Spin spinning={loading}>
			<Tabs
				tabBarExtraContent={
					<>
						{recordThongKe?.danhSachFilterThongKe?.find((item) => item.loaiFilterThongKe === ELoaiFilterThongKe.DOT)
							?.tenThongKe && (
							<SelectDotKhaiBao
								multiple
								style={{ width: 500, marginRight: 8 }}
								placeholder='Lọc theo đợt'
								allowClear
								idQuyTrinh={recordQuyTrinh?._id ?? ''}
								onChange={(val: any) => {
									const filter: any = filters.filter((item: any) => item.field !== 'dotQuyTrinhId');
									setFilters(
										val.length
											? [...filter, { field: 'dotQuyTrinhId', values: val, operator: EOperatorType.INCLUDE }]
											: filter,
									);
								}}
							/>
						)}
						{recordThongKe?.danhSachFilterThongKe
							?.filter((item) => item.loaiFilterThongKe === ELoaiFilterThongKe.TRUONG_THONG_TIN)
							?.map((item) => (
								<Input placeholder={`Lọc theo ${item.tenThongKe}`} key={item.tenThongKe} />
							))}
						<Tooltip title='Làm mới dữ liệu'>
							<Button loading={loading} onClick={getData} size='small' type='link' icon={<ReloadOutlined />} />
						</Tooltip>
					</>
				}
				style={{ marginTop: -8 }}
			>
				<Tabs.TabPane tab='Bảng' key={'table'} tabKey='table'>
					<ViewTableThongKe data={data} />
				</Tabs.TabPane>
				{data.length && Object.keys(data?.[0])?.length === 2 && (
					<Tabs.TabPane tab='Biểu đồ tròn' key={'donut'} tabKey='donut'>
						<ViewDonutThongKe data={data} />
					</Tabs.TabPane>
				)}
				{data.length && Object.keys(data?.[0])?.length === 2 && (
					<Tabs.TabPane tab='Biểu đồ cột' key={'column'} tabKey='column'>
						<ViewColumnThongKe data={data} />
					</Tabs.TabPane>
				)}
			</Tabs>
		</Spin>
	);
};

export default ViewThongKe;
