import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { thongKePhieuDiem } from '@/services/DiemRenLuyen/PhieuDiem';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

import ColumnChart from '@/components/Chart/ColumnChart';
import { inputFormat } from '@/utils/utils';
import styles from './style.less';
import numeral from 'numeral';
import SelectDotDiemRenLuyen from '../DotVWA/components/SelectDot';

type Data = {
	Ngành: string;
	'Phân loại Khá': number;
	'Phân loại Trung bình': number;
	'Phân loại Tốt': number;
	'Phân loại XS': number;
	'Phân loại Yếu/Kém': number;
	'Không tham gia': number;
	'Tổng số sinh viên': number;
};

const ThongKePhieuDiem = () => {
	const { record, setRecord, danhSach } = useModel('diemrenluyen.dotvwa');
	const [data, setData] = useState<Data[]>([]);
	const [dataBieuDo, setDataBieuDo] = useState<any>();
	const getData = async () => {
		if (!record?.maHocKy) return;
		const res = await thongKePhieuDiem(record.maHocKy);
		setData(res?.data?.data ?? []);
		setDataBieuDo({
			'Xuất sắc': res?.data?.data?.map((item: Data) => item['Phân loại XS']),
			Tốt: res?.data?.data?.map((item: Data) => item['Phân loại Tốt']),
			Khá: res?.data?.data?.map((item: Data) => item['Phân loại Khá']),
			'Trung bình': res?.data?.data?.map((item: Data) => item['Phân loại Trung bình']),
			'Yếu/kém': res?.data?.data?.map((item: Data) => item['Phân loại Yếu/Kém']),
			'Không tham gia đánh giá': res?.data?.data?.map((item: Data) => item['Không tham gia']),
		});
	};

	useEffect(() => {
		getData();
	}, [record?.maHocKy]);

	const columnFinal: IColumn<any>[] = [
		{
			title: 'Ngành',
			dataIndex: 'Ngành',
			width: 200,
			render: (val) => <div style={{ fontWeight: val === 'Tổng cộng' ? 'bold' : undefined }}>{val}</div>,
		},
		// {
		// 	title: 'Tổng số sinh viên',
		// 	width: 120,
		// 	align: 'center',
		// },
		{
			title: 'Số sinh viên được đánh giá',
			width: 150,
			dataIndex: 'Tổng số sinh viên',
			align: 'center',
		},
		{
			title: 'Xuất sắc',
			width: 150,
			dataIndex: 'Phân loại XS',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
		{
			title: 'Tốt',
			width: 150,
			dataIndex: 'Phân loại Tốt',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
		{
			title: 'Khá',
			width: 150,
			dataIndex: 'Phân loại Khá',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
		{
			title: 'Trung bình',
			width: 150,
			dataIndex: 'Phân loại Trung bình',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
		{
			title: 'Yếu/Kém',
			width: 150,
			dataIndex: 'Phân loại Yếu/Kém',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
		{
			title: 'Không tham gia đánh giá',
			width: 150,
			align: 'center',
			dataIndex: 'Không tham gia',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
	];

	return (
		<Card title='Thống kê'>
			<SelectDotDiemRenLuyen
				value={record?._id}
				isSetRecord
				allowClear={false}
				onChange={(val) => setRecord(danhSach.find((item) => item._id === val))}
			/>
			<Row gutter={[16, 0]}>
				<Col xl={18} lg={12} md={12} sm={24} xs={24}>
					<ColumnChart
						height={500}
						title=''
						yLabel={['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu/kém', 'Không tham gia đánh giá']}
						colors={['#1fba36', '#0d6efd', '#0dcaf0', '#ffca2c', '#dc3545', '#ccc']}
						xAxis={data.map((item) => item.Ngành)}
						formatY={(val) => inputFormat(val ?? 0) + ''}
						yAxis={[
							dataBieuDo?.['Xuất sắc'],
							dataBieuDo?.['Tốt'],
							dataBieuDo?.['Khá'],
							dataBieuDo?.['Trung bình'],
							dataBieuDo?.['Yếu/kém'],
							dataBieuDo?.['Không tham gia đánh giá'],
						]}
					/>
				</Col>
				<Col xl={6} lg={12} md={12} sm={24} xs={24}>
					<br />
					<div className={styles.salesRank}>
						<ul className={styles.rankingList}>
							{data
								?.sort((a, b) => {
									return b['Tổng số sinh viên'] - a['Tổng số sinh viên'];
								})
								.map((item, i) => (
									<li key={item?.Ngành}>
										<span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>{i + 1}</span>
										<span className={styles.rankingItemTitle} title={item.Ngành}>
											{item.Ngành}
										</span>
										<span className={styles.rankingItemValue}>{numeral(item['Tổng số sinh viên']).format('0,0')}</span>
									</li>
								))}
						</ul>
					</div>
				</Col>
			</Row>
			<TableStaticData
				otherProps={{ pagination: false }}
				data={[
					...data,
					{
						Ngành: 'Tổng cộng',
						'Phân loại Khá': data.reduce((pre, cur) => {
							return pre + (cur?.['Phân loại Khá'] ?? 0);
						}, 0),
						'Phân loại Trung bình': data.reduce((pre, cur) => {
							return pre + (cur?.['Phân loại Trung bình'] ?? 0);
						}, 0),
						'Phân loại Tốt': data.reduce((pre, cur) => {
							return pre + (cur?.['Phân loại Tốt'] ?? 0);
						}, 0),
						'Phân loại XS': data.reduce((pre, cur) => {
							return pre + (cur?.['Phân loại XS'] ?? 0);
						}, 0),
						'Phân loại Yếu/Kém': data.reduce((pre, cur) => {
							return pre + (cur?.['Phân loại Yếu/Kém'] ?? 0);
						}, 0),
						'Không tham gia': data.reduce((pre, cur) => {
							return pre + (cur?.['Không tham gia'] ?? 0);
						}, 0),
						'Tổng số sinh viên': data.reduce((pre, cur) => {
							return pre + (cur?.['Tổng số sinh viên'] ?? 0);
						}, 0),
					},
				]}
				columns={columnFinal}
			/>
		</Card>
	);
};

export default ThongKePhieuDiem;
