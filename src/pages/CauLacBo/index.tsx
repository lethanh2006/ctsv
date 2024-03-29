import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormCauLacBo from './components/Form';
import { useEffect, useState } from 'react';
import ViewDetailCLB from './components/ViewDetail';
import { thongKeChung } from '@/services/CauLacBo';
import { ETrangThaiHoatDong } from '@/services/CauLacBo/constant';
import { ETrangThaiThanhVien } from '@/services/CauLacBo/constant';

const CauLacBoComponent = () => {
	const { handleEdit, deleteModel, getModel, setRecord, record: recordCLB } = useModel('caulacbo.caulacbo');
	const { danhSach, getAllModel } = useModel('tochucnhansu.donvi');
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<
		{
			cauLacBo: string;
			thanhVien: {
				[ETrangThaiThanhVien.DANG_HOAT_DONG]: number;
				[ETrangThaiThanhVien.NGUNG_HOAT_DONG]: number;
			};
			tongSoHoatDong: {
				[ETrangThaiHoatDong.CHUA_THUC_HIEN]: number;
				[ETrangThaiHoatDong.DA_THUC_HIEN]: number;
				[ETrangThaiHoatDong.HUY]: number;
			};
		}[]
	>([]);
	const getThongKe = async () => {
		const res = await thongKeChung();
		setDataThongKe(res?.data?.data ?? []);
	};

	useEffect(() => {
		getAllModel(false);
		getThongKe();
	}, []);

	const onCell = (record: CauLacBo.IRecord) => ({
		onClick: () => {
			setVisibleDetail(true);
			setRecord(record);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<CauLacBo.IRecord>[] = [
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'ten',
			width: 200,
			onCell,
		},
		{
			title: 'Logo',
			dataIndex: 'logo',
			width: 100,
			align: 'center',
			render: (val: string) => <img style={{ width: 30, height: 30 }} src={val} />,
			onCell,
		},
		{
			title: 'Đơn vị quản lý',
			dataIndex: 'donViQuanLy',
			width: 150,
			render: (val: string) => danhSach.find((item) => item._id === val)?.ten,
			align: 'center',
			onCell,
		},
		{
			title: 'Thành viên',
			width: 150,
			onCell,
			align: 'center',
			render: (rec) => {
				const recThongKe = dataThongKe.find((item) => item.cauLacBo === rec.ten);
				return recThongKe?.thanhVien ? (
					<div>
						{recThongKe?.thanhVien[ETrangThaiThanhVien.DANG_HOAT_DONG] +
							recThongKe?.thanhVien[ETrangThaiThanhVien.NGUNG_HOAT_DONG]}{' '}
						thành viên
					</div>
				) : (
					'Chưa có thành viên'
				);
			},
		},
		{
			title: 'Hoạt động',
			width: 150,
			onCell,
			align: 'center',
			render: (rec) => {
				const recThongKe = dataThongKe.find((item) => item.cauLacBo === rec.ten);
				return recThongKe?.tongSoHoatDong ? (
					<div>
						{recThongKe?.tongSoHoatDong[ETrangThaiHoatDong.CHUA_THUC_HIEN] +
							recThongKe?.tongSoHoatDong[ETrangThaiHoatDong.DA_THUC_HIEN] +
							recThongKe?.tongSoHoatDong[ETrangThaiHoatDong.HUY]}{' '}
						hoạt động
					</div>
				) : (
					'Chưa có hoạt động'
				);
			},
		},
		{
			title: 'Nội quy, quy chế',
			dataIndex: 'noiQuyQuyChe',
			width: 100,
			align: 'center',
			render: (val) => (
				<a href={val} target='_blank' rel='noreferrer'>
					Xem chi tiết
				</a>
			),
		},
		{
			title: 'Quyết định thành lập',
			dataIndex: 'quyetDinhThanhLap',
			width: 120,
			align: 'center',
			render: (val) => (
				<a href={val} target='_blank' rel='noreferrer'>
					Xem chi tiết
				</a>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CauLacBo.IRecord) => (
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
					<Tooltip title='Xem chi tiết'>
						<Button
							onClick={() => {
								setRecord(record);
								setVisibleDetail(true);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				widthDrawer={800}
				Form={FormCauLacBo}
				title='Quản lý câu lạc bộ'
				modelName={'caulacbo.caulacbo'}
				columns={columns}
			/>
			<Modal
				bodyStyle={{ paddingTop: 4 }}
				width={1100}
				footer={
					<Button
						onClick={() => {
							setVisibleDetail(false);
						}}
					>
						Đóng
					</Button>
				}
				title={recordCLB?.ten}
				visible={visibleDetail}
				onCancel={() => setVisibleDetail(false)}
			>
				<ViewDetailCLB dataThongKe={dataThongKe.find((item) => item.cauLacBo === recordCLB?.ten) as any} />
			</Modal>
		</>
	);
};

export default CauLacBoComponent;
