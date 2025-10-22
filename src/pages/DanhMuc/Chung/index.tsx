import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import FormDanhMucChung from './components/Form';

import { useCallback } from 'react';

import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import type { DanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/typings';

const DanhMucChungComponent = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('quytrinh.danhmuc');

	const getData = () => {
		getModel({ maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
	};

	const columns: IColumn<DanhMucChung.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'maDanhMuc',
			width: 80,
			filterType: 'string',
		},
		{
			title: 'Giá trị',
			dataIndex: 'danhSachGiaTri',
			width: 250,
			render: (val: any[]) => (
				<div>
					{val.map((item) => (
						<div style={{ marginLeft: 4 }} key={item.value}>
							- {item.value}
						</div>
					))}
				</div>
			),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			align: 'center',
			width: 120,
			filterType: 'datetime',
			sortable: true,
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: DanhMucChung.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const Form = useCallback(
		() => <FormDanhMucChung maModule={ELoaiDanhMucChung.CHE_DO_CHINH_SACH} getData={getData} />,
		[],
	);

	return (
		<TableBase
			title='Danh mục chung'
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='quytrinh.danhmuc'
			Form={Form}
		/>
	);
};

export default DanhMucChungComponent;
