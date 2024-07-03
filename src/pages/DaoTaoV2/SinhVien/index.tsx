import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { formatPhoneNumber } from '@/utils/utils';
import { EyeOutlined, FileImageOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Button, Tooltip, Tag, message, Popconfirm, Modal } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import SelectKhoaNganh from '../NamHoc/KhoaNganh/components/Select';
import FilterKhoaSinhVien from '../NamHoc/KhoaSinhVien/components/FilterKhoaSinhVien';
import ModalSinhVien from './component/ModalSinhVien';
import PreviewHoSo from './component/PreviewHoSo';
import { ETrangThaiHocSv, colorTrangThaiHocSv } from '@/services/DaoTaoV2/SinhVien/constant';
import { handleLockHoSo, handleUnLockHoSo } from '@/services/DaoTaoV2/SinhVien';
import FormCapNhatAnhSV from './components/FormCapNhatAnhSV';
import KetQuaCapNhatAnhSV from './components/KetQuaCapNhatAnhSV';

const ViewSinhVien = () => {
	const { getModel, page, limit, isView, handleView, visibleFormCapNhatAnh, setvisibleFormCapNhatAnh } =
		useModel('daotaov2.sinhvien.sinhvien');
	const { record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');

	const getData = () => getModel({ maKhoaSinhVien: recKhoa?.ma, maNganh: recNganh?.ma });

	const handleLockHoSoModel = async (id: string) => {
		try {
			const res = await handleLockHoSo(id);
			if (res) {
				message.success('Khoá hồ sơ thành công');
				getData();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleUnLockHoSoModel = async (id: string) => {
		try {
			const res = await handleUnLockHoSo(id);
			if (res) {
				message.success('Mở khoá hồ sơ thành công');
				getData();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const onCell = (rec: SinhVien.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVien.IRecord>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: 'ma',
			width: 140,
			sortable: true,
			filterType: 'string',
			align: 'center',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			width: 100,
			filterType: 'date',
			sortable: true,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'CCCD',
			dataIndex: 'cccd',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 120,
			filterType: 'string',
			render: (val) => val && formatPhoneNumber(val),
			onCell,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Khóa ngành',
			dataIndex: 'maKhoaNganh',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaNganh multiple />,
			render: (val, rec) => rec.khoaNganh?.ten ?? val,
			onCell,
		},
		{
			title: 'Trạng thái học',
			dataIndex: 'trangThaiHoc',
			align: 'center',
			width: 140,
			filterType: 'select',
			filterData: Object.values(ETrangThaiHocSv),
			render: (val, rec) => <Tag color={colorTrangThaiHocSv[val as ETrangThaiHocSv]}>{val}</Tag>,
			onCell,
		},
		{
			title: 'Cập nhật lúc',
			dataIndex: 'updatedAt',
			width: 120,
			sortable: true,
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'choPhepSua',
			width: 120,
			align: 'center',
			fixed: 'right',
			render: (val) => (val ? <Tag color='green'>Mở khóa</Tag> : <Tag color='red'>Khóa</Tag>),
			filterType: 'select',
			filterData: [
				{ value: true, label: 'Mở khóa' },
				{ value: false, label: 'Khóa' },
			],
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: SinhVien.IRecord) => (
				<>
					<Tooltip title='Xem chi tiết'>
						<Button onClick={() => handleView(record)} type='link' icon={<EyeOutlined />} />
					</Tooltip>
					<Tooltip title={record?.choPhepSua ? 'Khoá hồ sơ' : 'Mở khoá hồ sơ'}>
						<Popconfirm
							title={
								record?.choPhepSua
									? 'Bạn có chắc chắn muốn khoá chỉnh sửa hồ sơ này?'
									: 'Bạn có chắc chắn muốn mở khoá chỉnh sửa hồ sơ này?'
							}
							onConfirm={() => {
								if (record?.choPhepSua) {
									handleLockHoSoModel(record?._id);
								} else {
									handleUnLockHoSoModel(record?._id);
								}
							}}
						>
							<Button
								// onClick={() => {
								// 	if (record?.choPhepSua) {
								// 		handleLockHoSo(record?._id);
								// 	} else {
								// 		handleUnLockHoSoModel(record?._id);
								// 	}
								// }}
								type='link'
								icon={record?.choPhepSua ? <LockOutlined /> : <UnlockOutlined />}
							/>
						</Popconfirm>
					</Tooltip>
					{/* <Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa sinh viên này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip> */}
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit, recKhoa?.ma, recNganh?.ma]}
				modelName='daotaov2.sinhvien.sinhvien'
				title={'Danh sách sinh viên'}
				Form={isView ? PreviewHoSo : ModalSinhVien}
				formProps={{ hasEdit: true }}
				widthDrawer={1200}
				rowSelection
				deleteMany
				buttons={{ import: false, export: true, create: false }}
				otherButtons={[
					<FilterKhoaSinhVien key={'filter'} hasSelectNganh allowClear />,
					<Button
						onClick={() => {
							setvisibleFormCapNhatAnh(true);
						}}
						icon={<FileImageOutlined />}
						key={'image'}
						type='primary'
					>
						Cập nhật ảnh thẻ SV
					</Button>,
				]}
			/>
			<Modal
				visible={visibleFormCapNhatAnh}
				onCancel={() => setvisibleFormCapNhatAnh(false)}
				bodyStyle={{ padding: 0 }}
				footer={false}
			>
				<FormCapNhatAnhSV getData={getData} />
			</Modal>
			<KetQuaCapNhatAnhSV />
		</>
	);
};

export default ViewSinhVien;
