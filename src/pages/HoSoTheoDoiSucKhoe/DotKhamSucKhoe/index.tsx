import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/HocKy/components/SelectHocKy';
import { ETrangThaiKhamSucKhoe, colorETrangThaiKhaiBaoSucKhoe } from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { ArrowDownOutlined, CheckOutlined, DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Popover, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import ModalDotKhamSucKhoe from './components/ModalDotKhamSucKhoe';
import { useState } from 'react';
import ModalYeuCauChinhSua from './components/ModalYeuCauChinhSua';
import ExpandText from '@/components/ExpandText';

const DotKhamSucKhoePage = () => {
	const { page, limit, deleteModel, handleEdit, putModel, getModel, setRecord } = useModel(
		'hosotheodoisuckhoe.dotkhamsuckhoe',
	);
	const { record: recHocKy, setRecord: retRecHocKy, danhSach: danhSachHocKy } = useModel('hocky.hocky');
	const [viewYeuCau, setViewYeuCau] = useState<boolean>(false);

	const onCell = (record: DotKhamSucKhoe.IRecord) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	const handleDuyet = (record: DotKhamSucKhoe.IRecord) => {
		putModel(record._id ?? '', { ...record, trangThai: ETrangThaiKhamSucKhoe.DA_DUYET, ghiChu: '' }, getData)
			.then()
			.catch((err) => console.log(err));
	};

	const columns: IColumn<any>[] = [
		{
			title: 'Học kỳ',
			dataIndex: 'tenHocKy',
			width: 150,
			onCell,
		},
		{
			title: 'Tên đợt khám',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiKhamSucKhoe),
			render: (val, rec) => <Tag color={colorETrangThaiKhaiBaoSucKhoe[val as ETrangThaiKhamSucKhoe]}>{val}</Tag>,
			width: 120,
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (rec) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id)}
							title='Bạn có chắc chắn muốn xóa đợt khám sức khỏe này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
					<Popover
						placement='bottomLeft'
						content={
							<>
								<Popconfirm
									onConfirm={() => handleDuyet(rec)}
									title='Bạn có chắc chắn muốn duyệt đợt khám sức khỏe?'
									placement='topRight'
								>
									<ButtonExtend tooltip='Duyệt' type='link' className='btn-success' icon={<CheckOutlined />} />
								</Popconfirm>
								<ButtonExtend
									onClick={() => (setViewYeuCau(true), setRecord(rec))}
									tooltip='Yêu cầu chỉnh sửa'
									type='link'
									icon={<EditOutlined style={{ color: 'yellow' }} />}
								/>
								<ButtonExtend tooltip='Tải biểu mẫu' type='link' icon={<ArrowDownOutlined />} />
							</>
						}
					>
						<Button icon={<MenuOutlined />} />
					</Popover>
				</>
			),
		},
	];

	return (
		<Card title='Đợt khai báo sức khỏe'>
			<TableBase
				columns={columns}
				params={{ maHocKy: recHocKy?.ma }}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName='hosotheodoisuckhoe.dotkhamsuckhoe'
				title='Đợt khám sức khỏe'
				Form={ModalDotKhamSucKhoe}
				widthDrawer={1000}
				hideCard
				rowSelection
				deleteMany
				otherButtons={[
					<>
						<SelectHocKy
							style={{ width: 250 }}
							value={recHocKy?.ma}
							onChange={(val) => {
								retRecHocKy(danhSachHocKy.find((item) => item.ma === val));
							}}
							isSetRecord
							selectMa
						/>
					</>,
				]}
			/>
			<ModalYeuCauChinhSua visibleForm={viewYeuCau} setVisibleForm={setViewYeuCau} />
		</Card>
	);
};

export default DotKhamSucKhoePage;
