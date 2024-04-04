import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';

import { inputFormat } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Table } from 'antd';
import _ from 'lodash';
import { useModel } from 'umi';
import FormDuToanKinhPhi from './FormDuToanKinhPhi';
import { EDonViTinh, mapDonViTinh } from '@/services/HoatDongChung/constants';
import { useState } from 'react';

const TableDuToanKinhPhi = () => {
	const { record: recHoatDong, setRecord: setRecHoatDong } = useModel('hoatdongchung');
	const [visibleForm, setVisibleForm] = useState(false);
	const [recDuToan, setRecDuToan] = useState<HoatDongChung.IDuToanKinhPhi>();
	const [edit, setEdit] = useState<boolean>(false);
	const onCell = (rec: HoatDongChung.IDuToanKinhPhi) => ({
		onClick: () => {},
		style: { cursor: 'pointer' },
	});

	const onCancel = () => {
		setVisibleForm(false);
	};

	const columns: IColumn<HoatDongChung.IDuToanKinhPhi & { index: number }>[] = [
		{
			title: 'Chi tiết công việc',
			dataIndex: 'hoatDong',
			width: 180,
			filterType: 'string',
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'ĐVT',
			dataIndex: 'donViTinh',
			align: 'center',
			width: 100,
			filterType: 'select',
			filterData: Object.values(EDonViTinh).map((item) => ({
				label: mapDonViTinh[item as EDonViTinh],
				value: item,
			})),
			render: (val, rec) =>
				val === EDonViTinh.KHAC ? <>Khác ({rec?.donViTinhKhac})</> : mapDonViTinh[val as EDonViTinh],
			onCell,
		},
		{
			title: 'SL',
			dataIndex: 'soLuong',
			align: 'center',
			width: 100,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Định mức (VNĐ)',
			dataIndex: 'dinhMuc',
			align: 'center',
			width: 100,
			render: (val, rec) => inputFormat(val),
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Thành tiền (VNĐ)',
			align: 'center',
			width: 120,
			render: (val, rec) => inputFormat(rec.dinhMuc * rec.soLuong),
			onCell,
		},
		{
			title: 'Tiến độ hoàn thành',
			dataIndex: 'tienDoHoanThanh',
			width: 120,
			onCell,
		},
		{
			title: 'Chứng từ yêu cầu',
			dataIndex: 'chungTuYeuCau',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec, index) => (
				<>
					<ButtonExtend
						tooltip='Chỉnh sửa'
						type='link'
						onClick={() => {
							setRecDuToan(rec);
							setVisibleForm(true);
							setEdit(true);
						}}
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => {
							setRecHoatDong({
								...recHoatDong,
								danhSachDuToanKinhPhi:
									recHoatDong?.danhSachDuToanKinhPhi
										?.map((item, ind: number) => ({ ...item, index: ind }))
										?.filter((item) => item.index !== index)
										.map((item, ind) => ({ ...item, index: ind })) ?? [],
							} as HoatDongChung.IRecord);
						}}
						title='Bạn có chắc chắn muốn xóa?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				data={recHoatDong?.danhSachDuToanKinhPhi ?? []}
				columns={columns}
				size='small'
				addStt
				otherProps={{
					pagination: false,
					scroll: { y: 250 },
					summary: (pageData: HoatDongChung.IDuToanKinhPhi[]) => {
						const tongTien = _.sumBy(pageData, (item) => item.dinhMuc * item.soLuong);
						return (
							<Table.Summary fixed>
								<Table.Summary.Row>
									<Table.Summary.Cell align='center' index={0} colSpan={5}>
										<b>Tổng tiền</b>
									</Table.Summary.Cell>
									<Table.Summary.Cell align='right' index={1}>
										<b> {inputFormat(tongTien ?? 0)} VND</b>
									</Table.Summary.Cell>
									<Table.Summary.Cell index={2} />
									<Table.Summary.Cell index={3} />
									<Table.Summary.Cell index={4} />
								</Table.Summary.Row>
							</Table.Summary>
						);
					},
				}}
				hasTotal
			>
				<ButtonExtend
					icon={<PlusCircleOutlined />}
					onClick={() => {
						setVisibleForm(true);
						setRecDuToan(undefined);
						setEdit(false);
					}}
					size='small'
					type='primary'
				>
					Thêm mới
				</ButtonExtend>
			</TableStaticData>

			<Modal
				title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} dự toán kinh phí`}
				visible={visibleForm}
				width={800}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormDuToanKinhPhi record={recDuToan} edit={edit} onCancel={onCancel} />
			</Modal>
		</>
	);
};

export default TableDuToanKinhPhi;
