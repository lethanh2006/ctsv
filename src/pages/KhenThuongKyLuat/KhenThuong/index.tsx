import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type QuyetDinhKhenThuong } from '@/services/KhenThuong/QuyetDinhKhenThuong/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import {
	FormKhenThuongTheoQuyetDinh,
	type FormKhenThuongTheoQuyetDinhProps,
} from './components/FormKhenThuongTheoQuyetDinh';
import { useEffect, useRef } from 'react';

export default () => {
	const {
		handleEdit: handleEdit_,
		handleView,
		visibleForm,
		setVisibleForm,
		setDanhSach,
		danhSach,
		record,
		edit,
		setEdit,
		setIsView,
	} = useModel('khenthuongkyluat.khenthuong.quyetdinhkhenthuong');

	const handleEdit = (tableRecord: QuyetDinhKhenThuong.IRecord) => {
		handleEdit_(tableRecord);
		setVisibleForm(true);
		setEdit(true);
		setIsView(false);
	};

	const onCell = (rec: QuyetDinhKhenThuong.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<QuyetDinhKhenThuong.IRecord>[] = [
		{
			title: 'Số quyết định',
			dataIndex: 'soQuyetDinh',
			width: 160,
			filterType: 'string',
			onCell,
		},
		// {
		// 	title: 'Cơ quan quyết định',
		// 	dataIndex: 'coQuanQuyetDinh',
		// 	width: 180,
		// 	filterType: 'string',
		// onCell,
		// },
		{
			title: 'Ngày quyết định',
			width: 160,
			dataIndex: 'ngayQuyetDinh',
			filterType: 'date',
			sortable: true,
			onCell,
			align: 'center',
			render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : null),
		},
		{
			title: 'Ngày ký',
			width: 160,
			dataIndex: 'ngayKy',
			filterType: 'date',
			sortable: true,
			onCell,
			align: 'center',
			render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : null),
		},

		{
			title: 'Người ký',
			dataIndex: 'nguoiKy',
			width: 160,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (_, tableRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(tableRecord)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								setDanhSach((state) => state.filter((item) => item._id !== tableRecord._id));
								message.success('Xóa thành công');
							}}
							title='Bạn có chắc chắn muốn xóa khen thưởng này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const mounted = useRef(false);

	useEffect(() => {
		try {
			if (mounted.current) {
				localStorage.setItem('danhSachQuyetDinhKhenThuong', JSON.stringify(danhSach ?? []));
			}
		} catch {
			/** empty */
		}
	}, [danhSach]);

	useEffect(() => {
		try {
			if (!danhSach?.length) {
				const localData = JSON.parse(localStorage.getItem('danhSachQuyetDinhKhenThuong') ?? '');
				setDanhSach(Array.isArray(localData) ? localData : []);
			}
		} catch {
			setDanhSach([]);
			/** empty */
		}
		mounted.current = true;
	}, []);
	return (
		<Card title='Khen thưởng'>
			<TableStaticData
				addStt
				data={danhSach ?? []}
				columns={columns}
				hasCreate
				showEdit={visibleForm}
				setShowEdit={(vi) => {
					setVisibleForm(vi);
					setIsView(false);
					setEdit(false);
				}}
				Form={FormKhenThuongTheoQuyetDinh as any}
				formProps={
					{
						onFinishProps: (value) => {
							setDanhSach((state) => {
								if (edit) {
									return state.map<any>((item) => {
										if (record?._id === item._id) {
											return {
												...item,
												...value,
											};
										}
										return item;
									});
								} else {
									return state.concat({
										...value,
										_id: Math.random().toString(36).slice(2),
									} as any);
								}
							});
						},
					} as FormKhenThuongTheoQuyetDinhProps
				}
				widthDrawer={900}
			/>
		</Card>
	);
};
