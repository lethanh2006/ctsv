import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ELoaiThoiGianMienGiam } from '@/services/CheDoChinhSach/constant';
import type { CheDoChinhSach } from '@/services/CheDoChinhSach/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {Button, Popconfirm, Select, Tooltip} from 'antd';
import { useModel } from 'umi';
import { SelectHocKy } from '../DaoTao/HocKy/SelectHocKy';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { toISOString } from '@/utils/utils';
import { useEffect } from 'react';
import FormCheDoChinhSach from './components/Form';
import moment from 'moment';

const CheDoChinhSachComponent = () => {
	const {
		page,
		limit,
		handleEdit,
		deleteModel,
		getModel,
		condition,
		setCondition,
		getDanhMucLoaiCheDoChinhSachModel,
		danhMucLoaiCheDoChinhSach,
	} = useModel('chedochinhsach.chedochinhsach');

	useEffect(() => {
		getDanhMucLoaiCheDoChinhSachModel();
	}, []);

	const columns: IColumn<CheDoChinhSach.IRecord>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			filterType: 'string',
			width: 200,
			align: 'center',
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'maDinhDanh',
			filterType: 'string',
			width: 200,
			align: 'center',
		},
		{
			title: 'Đối tượng miễn giảm',
			dataIndex: 'doiTuongMienGiam',
			filterType: 'string',
			width: 200,
		},
		{
			title: 'Mức miễn giảm',
			dataIndex: 'mucMienGiam',
			filterType: 'string',
			width: 200,
			align: 'center',
		},
		{
			title: 'Thời gian miễn giảm',
			dataIndex: 'loaiThoiGianMienGiam',
			filterType: 'string',
			width: 200,
			align: 'center',
			render: (val: ELoaiThoiGianMienGiam, rec: CheDoChinhSach.IRecord) => {
				return (
					<div>
						{val === ELoaiThoiGianMienGiam.HOC_KY
							? rec.tenHocKyMienGiam
							: `${moment(rec.thoiGianMienGiamBatDau).format('DD/MM/YYYY')} - ${moment(
									rec.thoiGianMienGiamKetThuc,
							  ).format('DD/MM/YYYY')}`}
					</div>
				);
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CheDoChinhSach.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								handleEdit(record);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								deleteModel(record._id, getModel);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				title='Danh sách sinh viên được hưởng chế độ chính sách'
				modelName='chedochinhsach.chedochinhsach'
				columns={columns}
				widthDrawer={500}
				dependencies={[page, limit]}
				Form={FormCheDoChinhSach}
				otherButtons={[
					<Select
						onChange={(val) => {
							setCondition({ ...condition, loaiCheDoChinhSach: val });
						}}
						placeholder='Chế độ chính sách'
						allowClear
						style={{ width: 250 }}
						key={'0'}
						options={danhMucLoaiCheDoChinhSach.map((item) => ({ value: item, label: item }))}
					/>,
					<Select
						onChange={(val) =>
							setCondition({
								...condition,
								loaiThoiGianMienGiam: val,
								maHocKyMienGiam: undefined,
								thoiGianMienGiamBatDau: undefined,
								thoiGianMienGiamKetThuc: undefined,
							})
						}
						placeholder='Thời gian miễn giảm'
						options={Object.values(ELoaiThoiGianMienGiam).map((item) => ({ value: item, label: item }))}
						key={'1'}
						allowClear
						style={{ width: 200 }}
					/>,
					<div key={'2'}>
						{condition?.loaiThoiGianMienGiam === ELoaiThoiGianMienGiam.HOC_KY && (
							<SelectHocKy
								selectMa
								style={{ width: 250 }}
								allowClear
								onChange={(val) => setCondition({ ...condition, maHocKyMienGiam: val })}
							/>
						)}
						{condition?.loaiThoiGianMienGiam === ELoaiThoiGianMienGiam.THOI_GIAN && (
							<MyDateRangePicker
								allowClear
								onChange={(val) => {
									setCondition({
										...condition,
										thoiGianMienGiamBatDau: val ? { $lte: toISOString(val[1]) } : undefined,
										thoiGianMienGiamKetThuc: val ? { $gte: toISOString(val[0]) } : undefined,
									});
								}}
							/>
						)}
					</div>,
				]}
			/>
		</>
	);
};

export default CheDoChinhSachComponent;
