import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Popconfirm, Space, Tooltip } from 'antd';
import { type FormInstance } from 'antd/es/form/Form';
import { useWatch } from 'antd/lib/form/Form';
import { useState } from 'react';
import { type FormValues } from '..';
import { FormCaNhan, type FormCaNhanValues } from './FormCaNhan';
import { type QuyetDinhKhenThuong } from '@/services/KhenThuong/QuyetDinhKhenThuong/typing';
import { type ELoaiKhenThuong } from '@/services/KhenThuong/constants';
import styles from './styles.less';
import { type SinhVien } from '@/services/SinhVien/typings';

interface Props {
	form: FormInstance<FormValues>;
	dataDanhSachCaNhan?: QuyetDinhKhenThuong.CaNhan[];
	isXemDanhSach?: boolean;
}

type TableRecord = {
	ssoId: string;
	sinhVien: SinhVien.IRecord;
	// capKhenThuongId: string;
	// capKhenThuong: CapKhenThuong.IRecord;
	loaiKhenThuongId: string;
	loaiKhenThuong: LoaiKhenThuong.IRecord;
	// phuongThucKhenThuongId: string;
	// phuongThucKhenThuong: PhuongThucKhenThuong.IRecord;
	hinhThucKhenThuongId: string;
	hinhThucKhenThuong: HinhThucKhenThuong.IRecord;
	anhHuongThoiGianKhenThuong: boolean;
	thoiGianDieuChinh: number;
	daXetDieuChinhTangLuong: boolean;
	loai: ELoaiKhenThuong;
};

export const DanhSachCaNhan = ({ form, dataDanhSachCaNhan, isXemDanhSach }: Props) => {
	const danhSachCaNhanFormValue = useWatch(['danhSachCaNhan'], form) ?? [];
	const danhSachCaNhanValue: FormValues['danhSachCaNhan'] = dataDanhSachCaNhan ?? danhSachCaNhanFormValue;

	const [formVisible, setFormVisible] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isCreate, setIsCreate] = useState(false);
	const [isView, setIsView] = useState(false);
	const [record, setRecord] = useState<FormCaNhanValues | undefined>(undefined);
	const [indexRecordDangThaoTac, setIndexRecordDangThaoTac] = useState<number | undefined>(undefined);

	const handleEditCaNhan = (tableRecord: TableRecord, index: number) => {
		setFormVisible(true);
		setIsEdit(true);
		setIsCreate(false);
		setIsView(false);
		setRecord(tableRecord);
		setIndexRecordDangThaoTac(index);
	};

	const handleCreateCaNhan = (vi: boolean) => {
		setFormVisible(vi);
		setIsCreate(vi);
		setIsEdit(false);
		setIsView(false);
		setRecord(undefined);
	};

	const handleViewCaNhan = (tableRecord: TableRecord) => {
		setFormVisible(true);
		setIsView(true);
		setIsCreate(false);
		setIsEdit(false);
		setRecord(tableRecord);
	};

	const handleSubmitFormCaNhan = (values: FormCaNhanValues) => {
		const prevCaNhan: FormValues['danhSachCaNhan'] = form.getFieldValue(['danhSachCaNhan']) ?? [];

		if (isCreate) {
			form.setFieldsValue({
				danhSachCaNhan: [values, ...(prevCaNhan ?? [])],
			});
		} else if (isEdit) {
			form.setFieldsValue({
				danhSachCaNhan: prevCaNhan.map((danhSachCaNhan, index) => {
					if (indexRecordDangThaoTac === index) {
						return {
							...danhSachCaNhan,
							...values,
						};
					}
					return danhSachCaNhan;
				}),
			});
		}

		setIndexRecordDangThaoTac(undefined);
		setFormVisible(false);
		setIsCreate(false);
		setIsEdit(false);
		setIsView(false);
	};

	const handleCancelFormCaNhan = () => {
		setFormVisible(false);
		setIsCreate(false);
		setIsEdit(false);
		setIsView(false);
		setIndexRecordDangThaoTac(undefined);
	};

	const handleDeleteCaNhan = (index: number) => {
		const prevCaNhan: QuyetDinhKhenThuong.CaNhan[] = form.getFieldValue(['danhSachCaNhan']) ?? [];
		form.setFieldsValue({
			danhSachCaNhan: prevCaNhan.filter((_, danhSachCaNhanIndex) => danhSachCaNhanIndex !== index),
		});
	};

	const onCell = (rec: TableRecord) => ({
		onClick: () => handleViewCaNhan(rec),
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<TableRecord>[] = [
		{
			width: 140,
			dataIndex: ['sinhVien', 'ten'],
			filterType: 'string',
			onCell,
			title: 'Họ và tên',
		},
		{
			width: 140,
			dataIndex: ['loaiKhenThuong', 'ten'],
			filterType: 'string',
			onCell,
			title: 'Loại khen thưởng',
		},
		{
			width: 140,
			dataIndex: ['hinhThucKhenThuong', 'ten'],
			filterType: 'string',
			onCell,
			title: 'Hình thức khen thưởng',
		},
	];

	if (!isXemDanhSach) {
		columns.push({
			width: 90,
			align: 'center',
			title: 'Thao tác',
			render: (_, tableRecord, index) => {
				return (
					<>
						<Tooltip title='Sửa thông tin'>
							<Button onClick={() => handleEditCaNhan(tableRecord, index)} type='link' icon={<EditOutlined />} />
						</Tooltip>
						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => handleDeleteCaNhan(index)}
								title='Bạn có chắc chắn muốn xóa nhân sự này?'
								placement='topLeft'
							>
								<Button danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					</>
				);
			},
		});
	}

	return (
		<Form.Item className={styles.block} name={'danhSachCaNhan'} label='Khen thưởng cá nhân'>
			<TableStaticData
				hasTotal
				size='small'
				addStt
				Form={FormCaNhan}
				formProps={{
					onFinish: handleSubmitFormCaNhan,
					onCancel: handleCancelFormCaNhan,
					isCreate,
					isEdit,
					record,
					isView,
					ignoreCacCanBo: danhSachCaNhanValue,
				}}
				columns={columns}
				data={danhSachCaNhanValue}
				widthDrawer={800}
				setShowEdit={handleCreateCaNhan}
				showEdit={formVisible}
			>
				{!isXemDanhSach && (
					<Space>
						<Button onClick={() => handleCreateCaNhan(true)} size='small' type='primary' icon={<PlusOutlined />}>
							Thêm mới
						</Button>
					</Space>
				)}
			</TableStaticData>
		</Form.Item>
	);
};
