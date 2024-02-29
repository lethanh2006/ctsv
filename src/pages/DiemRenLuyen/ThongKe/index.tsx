import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { thongKePhieuDiem } from '@/services/DiemRenLuyen/PhieuDiem';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectDotDiemRenLuyen from '../Dot/components/SelectDot';
import ColumnChart from '@/components/Chart/ColumnChart';
import { inputFormat } from '@/utils/utils';
import styles from './style.less';
import numeral from 'numeral';

type Data = {
	Ngành: string;
	'Phân loại Khá': number;
	'Phân loại Trung bình': number;
	'Phân loại Tốt': number;
	'Phân loại XS': number;
	'Phân loại Yếu/Kém': number;
	'Tổng số sinh viên': number;
};

const ThongKePhieuDiem = () => {
	const { record, setRecord, danhSach } = useModel('diemrenluyen.dot');
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
		});
	};

	useEffect(() => {
		getData();
	}, [record?.maHocKy]);

	const column: IColumn<Data>[] = Object.keys(data?.[0] ?? {}).map((key: any) => ({
		title: key,
		dataIndex: key,
		width: 150,
		align: 'center',
	}));

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
						yLabel={['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu/kém']}
						colors={['#1fba36', '#0d6efd', '#0dcaf0', '#ffca2c', '#dc3545']}
						xAxis={data.map((item) => item.Ngành)}
						formatY={(val) => inputFormat(val ?? 0) + ''}
						yAxis={[
							dataBieuDo?.['Xuất sắc'],
							dataBieuDo?.['Tốt'],
							dataBieuDo?.['Khá'],
							dataBieuDo?.['Trung bình'],
							dataBieuDo?.['Yếu/kém'],
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
			<TableStaticData data={data} columns={column} />
		</Card>
	);
};

export default ThongKePhieuDiem;
