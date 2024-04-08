import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { EHoatDongChungType1 } from '@/services/HoatDongChung/constants';
import { EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectHocKy from '../DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import FormHoatDongChung from './Form';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';
import { thongKe } from '@/services/HoatDongChung';
import ThongKe from './ThongKeSoLuong';
import SelectCLB from '../CauLacBo/components/SelectCLB';

const HoatDongChungPage = (props: {
	phanLoaiCap1: EHoatDongChungType1;
	phanLoaiCap2: EHoatDongChungType2;
	title?: string;
	hideCard?: boolean;
	paramCondition?: any;
}) => {
	const { getModel, condition, setCondition, handleEdit, deleteModel, filters } = useModel('hoatdongchung');
	const { danhSach: danhSachCauLacBo } = useModel('caulacbo.caulacbo');
	const { danhSach } = useModel('daotaov2.hocky.hocky');
	const [dataThongKe, setDataThongKe] = useState<any>();
	const getData = () => {
		getModel({ phanLoaiCap1: props.phanLoaiCap1, phanLoaiCap2: props.phanLoaiCap2, ...(props?.paramCondition ?? {}) });
	};

	const getThongKe = async () => {
		const res = await thongKe({
			condition: {
				...condition,
				phanLoaiCap1: props.phanLoaiCap1,
				phanLoaiCap2: props.phanLoaiCap2,
				...(props?.paramCondition ?? {}),
			},
			filters,
		});
		setDataThongKe(res?.data?.data?.[0]);
	};

	useEffect(() => {
		getThongKe();
	}, [condition, JSON.stringify(props.paramCondition), props.phanLoaiCap1, props.phanLoaiCap2, filters]);

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
			title: 'Câu lạc bộ',
			dataIndex: ['info', 'refId'],
			width: 200,
			align: 'center',
			hide: ![EHoatDongChungType2.HOAT_DONG_CAU_LAC_BO].includes(props.phanLoaiCap2),
			render: (val) => danhSachCauLacBo.find((item) => item._id === val)?.ten,
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
		<>
			<div style={{ marginBottom: 16 }}>
				<ThongKe data={dataThongKe} />
			</div>

			<TableBase
				hideCard={props?.hideCard ?? false}
				getData={getData}
				dependencies={[props.phanLoaiCap1, props.phanLoaiCap2, JSON.stringify(props.paramCondition), props.hideCard]}
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
					<>
						{[EHoatDongChungType2.HOAT_DONG_CAU_LAC_BO].includes(props.phanLoaiCap2) && (
							<SelectCLB
								allowClear
								onChange={(val) =>
									setCondition({
										...condition,
										info: val
											? {
													type: 'CAU_LAC_BO',
													refId: val,
											  }
											: undefined,
									})
								}
								style={{ width: 300 }}
							/>
						)}
					</>,
				]}
				Form={Form}
				columns={column}
				modelName='hoatdongchung'
				title={props?.title ?? props.phanLoaiCap2}
			/>
		</>
	);
};

export default HoatDongChungPage;
