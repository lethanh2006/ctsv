import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import {
	EXepLoaiDiemRenLuyenLabel,
	MapKeyColorXepLoaiDiemRenLuyenLabel,
} from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Descriptions, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectDotDiemRenLuyen from '../Dot/Select';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/typing';

const PhieuTongHop = (props: { tenLop?: string; idLop: string }) => {
	const { getPhieuTongHopModel, recPhieuTongHop, loading, exportPhieuTongHopModel } = useModel(
		'diemrenluyen.phieudiemrenluyen',
	);

	const { record: recDot, setRecord: setRecDot } = useModel('diemrenluyen.dot');

	useEffect(() => {
		if (props?.tenLop && recDot?._id) getPhieuTongHopModel(recDot._id, props.tenLop);
	}, [props.tenLop, recDot?._id]);
	const columns: IColumn<PhieuDiemRenLuyen.PhieuTongHopSV>[] = [
		{
			title: 'Họ đệm',
			dataIndex: 'hoDem',
			align: 'center',
			filterType: 'string',
			width: 120,
		},
		{
			title: 'Tên',
			dataIndex: 'ten',
			align: 'center',
			filterType: 'string',
			width: 100,
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'msv',
			align: 'center',
			filterType: 'string',
			width: 100,
		},
		{
			title: 'Điểm đánh giá',
			align: 'center',
			width: 400,
			children: [
				{
					title: 'ND1',
					align: 'center',
					dataIndex: 'nd1',
					width: 80,
					sortable: true,
					render: (val) => {
						return val ?? '--';
					},
				},
				{
					title: 'ND2',
					dataIndex: 'nd2',
					align: 'center',
					width: 80,
					sortable: true,
					render: (val) => {
						return val ?? '--';
					},
				},
				{
					title: 'ND3',
					align: 'center',
					dataIndex: 'nd3',
					width: 80,
					sortable: true,
					render: (val) => {
						return val ?? '--';
					},
				},
				{
					title: 'ND4',
					dataIndex: 'nd4',
					align: 'center',
					width: 80,
					sortable: true,
					render: (val) => {
						return val ?? '--';
					},
				},
				{
					title: 'ND5',
					dataIndex: 'nd5',
					align: 'center',
					width: 80,
					sortable: true,
					render: (val) => {
						return val ?? '--';
					},
				},
			],
		},
		{
			title: 'Tổng điểm',
			dataIndex: 'tongDiem',
			align: 'center',
			width: 100,
			sortable: true,
			render: (val) => (val ? val : '--'),
		},
		{
			title: 'Xếp hạng rèn luyện',
			dataIndex: 'xepHang',
			align: 'center',
			width: 100,
			filterType: 'select',
			filterData: Object.values(EXepLoaiDiemRenLuyenLabel),
			render: (val: EXepLoaiDiemRenLuyenLabel) =>
				val ? <Tag color={MapKeyColorXepLoaiDiemRenLuyenLabel[val]}>{val}</Tag> : '--',
		},
	];

	return (
		<>
			{' '}
			<h2 style={{ textAlign: 'center', marginBottom: 18 }}>TỔNG HỢP KẾT QUẢ RÈN LUYỆN CỦA SINH VIÊN</h2>
			<Descriptions column={{ xs: 1, md: 3 }}>
				<Descriptions.Item label='Lớp'>
					<b>{recPhieuTongHop?.lopHC ?? ''}</b>
				</Descriptions.Item>
				<Descriptions.Item label='Khoa'>
					<b>{recPhieuTongHop?.khoa ?? ''}</b>
				</Descriptions.Item>
				<Descriptions.Item label='Đợt'>
					<b>{recDot?.tenDot}</b>
				</Descriptions.Item>
			</Descriptions>
			<>
				<TableStaticData hasTotal data={recPhieuTongHop?.ds ?? []} columns={columns} loading={loading} addStt>
					<div>
						<SelectDotDiemRenLuyen
							style={{ width: 300 }}
							value={recDot?._id}
							onChange={(val, option) => {
								const rawData = option?.rawData;
								setRecDot(rawData);
							}}
							isSetRecord={true}
						/>
						<Button
							style={{ marginLeft: 8 }}
							loading={loading}
							onClick={() =>
								exportPhieuTongHopModel(recDot?._id ?? '', recPhieuTongHop?.lopHC ?? '', recDot?.tenDot ?? '')
							}
							key={'download'}
							icon={<DownloadOutlined />}
							type='primary'
						>
							Tải phiếu tổng hợp
						</Button>
					</div>
				</TableStaticData>
			</>
			<p style={{ marginTop: 18 }}>
				<b> Lưu ý: Kết quả điểm rèn luyện được phân thành các loại: </b>Xuất sắc, Tốt, Khá, Trung bình, Yếu, Kém
			</p>
			<Descriptions column={1} bordered>
				<Descriptions.Item label='Loại xuất sắc (từ 90 đến 100 điểm)'>
					{recPhieuTongHop?.sv1 ?? '--'} Sinh viên ({recPhieuTongHop?.xuatSac}
					%)
				</Descriptions.Item>
				<Descriptions.Item label='Loại tốt (từ 80 đến 90 điểm)'>
					{recPhieuTongHop?.sv2 ?? '--'} Sinh viên ({recPhieuTongHop?.tot}
					%)
				</Descriptions.Item>
				<Descriptions.Item label='Loại khá (từ 65 đến dưới 80 điểm)'>
					{recPhieuTongHop?.sv3 ?? '--'} Sinh viên ({recPhieuTongHop?.kha}
					%)
				</Descriptions.Item>
				<Descriptions.Item label='Loại trung bình (từ 50 đến dưới 65 điểm)'>
					{recPhieuTongHop?.sv4 ?? '--'} Sinh viên ({recPhieuTongHop?.tb}
					%)
				</Descriptions.Item>
				<Descriptions.Item label='Loại yếu (từ 35 đến dưới 50 điểm)'>
					{recPhieuTongHop?.sv5 ?? '--'} Sinh viên ({recPhieuTongHop?.y}
					%)
				</Descriptions.Item>
				<Descriptions.Item label='Loại kém (dưới 35 điểm)'>
					{recPhieuTongHop?.sv6 ?? '--'} Sinh viên ({recPhieuTongHop?.k}
					%)
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};

export default PhieuTongHop;
