import { EOperatorType } from '@/components/Table/constant';
import { ELoaiFilterThongKe } from '@/services/QuyTrinhDong/ThongKe/constant';
import { getDataThongKeJson as getDataThongKeJsonQuyTrinhDong } from '@/services/QuyTrinhDong/ThongKe/thongke';
import { getDataThongKeJson as getDataThongKeJsonCheDoChinhSach } from '@/services/CheDoSinhVien/index';

import { ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Spin, Tabs, Tooltip } from 'antd';
import type { Key } from 'react';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectDotKhaiBao from '../../components/DotKhaiBao/Select';
import ViewColumnThongKe from './ViewColumn';
import ViewDonutThongKe from './ViewDonut';
import ViewTableThongKe from './ViewTable';

const ViewThongKe = (props: { idThongKe: string; type: 'CheDoChinhSach' | 'QuyTrinhDong' }) => {
	const { danhSach }: any = useModel(props.type === 'CheDoChinhSach' ? 'chedochinhsach.thongke' : 'quytrinh.thongke');
	const getDataThongKeJson =
		props.type === 'CheDoChinhSach' ? getDataThongKeJsonCheDoChinhSach : getDataThongKeJsonQuyTrinhDong;
	const [filters, setFilters] = useState<any[]>([]);

	const { record: recordQuyTrinh } = useModel('quytrinh.quanlyquytrinh');
	const recordThongKe = danhSach.find((item: { _id: string }) => item._id === props.idThongKe);
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const getData = async () => {
		if (!props.idThongKe || !danhSach.map((item: { _id: any }) => item._id).includes(props.idThongKe)) return;
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
						{recordThongKe?.danhSachFilterThongKe?.find(
							(item: { loaiFilterThongKe: ELoaiFilterThongKe }) => item.loaiFilterThongKe === ELoaiFilterThongKe.DOT,
						)?.tenThongKe && (
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
						<div style={{ display: 'flex', alignItems: 'center' }}>
							{recordThongKe?.danhSachFilterThongKe
								?.filter(
									(item: { loaiFilterThongKe: ELoaiFilterThongKe }) =>
										item.loaiFilterThongKe === ELoaiFilterThongKe.TRUONG_THONG_TIN,
								)
								?.map((item: { truongThongTinThongKe: any; tenThongKe: Key | null | undefined }) => (
									<Input.Search
										onSearch={(val) => {
											const filter: any = filters.filter((fil: any) => fil.field !== item.truongThongTinThongKe);
											setFilters(
												val.length
													? [
															...filter,
															{ field: item.truongThongTinThongKe, values: [val], operator: EOperatorType.CONTAIN },
													  ]
													: filter,
											);
										}}
										placeholder={`Lọc theo ${item.tenThongKe}`}
										key={item.tenThongKe}
									/>
								))}
							<Tooltip title='Làm mới dữ liệu'>
								<Button loading={loading} onClick={getData} size='small' type='link' icon={<ReloadOutlined />} />
							</Tooltip>
						</div>
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
