import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { EHoatDongChungType1 } from '@/services/HoatDongChung/constants';
import { EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback } from 'react';
import { useModel } from 'umi';
import SelectHocKy from '../DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import FormHoatDongChung from './Form';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';

const HoatDongChungPage = (props: {
	phanLoaiCap1: EHoatDongChungType1;
	phanLoaiCap2: EHoatDongChungType2;
	title?: string;
	hideCard?: boolean;
	paramCondition?: any;
}) => {
	const { getModel, condition, setCondition, handleEdit, deleteModel } = useModel('hoatdongchung');
	const { danhSach } = useModel('daotaov2.hocky.hocky');
	const getData = () => {
		getModel({ phanLoaiCap1: props.phanLoaiCap1, phanLoaiCap2: props.phanLoaiCap2, ...(props?.paramCondition ?? {}) });
	};

	const column: IColumn<HoatDongChung.IRecord>[] = [
		{
			title: 'Tên hoạt động',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Loại',
			dataIndex: 'loai',
			width: 200,
			filterType: 'string',
			align: 'center',
			hide: ![EHoatDongChungType2.TUAN_LE_CONG_DAN, EHoatDongChungType2.HUONG_NGHIEP_VIEC_LAM].includes(
				props.phanLoaiCap2,
			),
		},
		{
			title: 'Học kỳ',
			dataIndex: 'maHocKy',
			width: 150,
			render: (val) => danhSach.find((item) => item.ma === val)?.ten,
			align: 'center',
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			align: 'center',
			width: 130,
			sortable: true,
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			align: 'center',
			width: 130,
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: HoatDongChung.IRecord) => (
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
								deleteModel(record._id, getData);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
					{/* <Tooltip title='Xem chi tiết'>
						<Button
							onClick={() => {
								setRecord(record);
								setVisibleDetail(true);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip> */}
				</>
			),
		},
	];

	const Form = useCallback(
		() => <FormHoatDongChung getData={getData} phanLoaiCap1={props.phanLoaiCap1} phanLoaiCap2={props.phanLoaiCap2} />,
		[props.phanLoaiCap1, props.phanLoaiCap2],
	);

	return (
		<TableBase
			hideCard={props?.hideCard ?? false}
			getData={getData}
			dependencies={[props.phanLoaiCap1, props.phanLoaiCap2, props.paramCondition, props.hideCard]}
			widthDrawer={1000}
			otherButtons={[
				<SelectHocKy
					allowClear
					onChange={(val) => setCondition({ ...condition, maHocKy: val })}
					style={{ width: 300 }}
					selectMa
					key={'hocky'}
					placeHolder='Lọc theo học kỳ'
				/>,
			]}
			Form={Form}
			columns={column}
			modelName='hoatdongchung'
			title={props?.title ?? props.phanLoaiCap2}
		/>
	);
};

export default HoatDongChungPage;
