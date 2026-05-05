import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, message, Upload } from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import Form from './components/Form';
import ButtonExtend from '@/components/Table/ButtonExtend';
import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';
import fileDownload from 'js-file-download';
import * as XLSX from 'xlsx';

const PhongKTXPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('kytucxa.phong');
	const { danhSach: danhSachKhoanThu, getAllModel: getAllKhoanThu } = useModel('kytucxa.khoanthu');
	const [exporting, setExporting] = useState(false);

	useEffect(() => {
		getAllKhoanThu();
	}, []);

	const handleExport = async () => {
		setExporting(true);
		try {
			const res = await axios.get(`${ipCsvc}/phong/ktx/export`, {
				responseType: 'blob',
			});
			fileDownload(res.data, 'Danh sách phòng.xlsx');
		} catch (error) {
			message.error('Lỗi khi xuất dữ liệu');
		} finally {
			setExporting(false);
		}
	};

	const uploadProps = {
		name: 'file',
		showUploadList: false,
		customRequest: async (options: any) => {
			const { file, onSuccess, onError } = options;
			
			if (typeof FileReader !== 'undefined') {
				const reader = new FileReader();
				reader.onload = async (e) => {
					try {
						const data = e.target?.result;
						const workbook = XLSX.read(data, { type: 'array' });
						const ws = workbook.Sheets[workbook.SheetNames[0]];
						const sheetData = XLSX.utils.sheet_to_json(ws);
						
						const payload = sheetData.map((row: any) => ({
							ma: row?.ma?.toString() || row?.['Mã phòng']?.toString() || row?.['Mã']?.toString() || '',
							soLuongToiDa: Number(row?.soLuongToiDa ?? row?.['Sức chứa'] ?? 0),
							cachBoTri: row?.cachBoTri?.toString() || row?.['Cách bố trí']?.toString() || '',
							moTa: row?.moTa?.toString() || row?.['Mô tả']?.toString() || '',
							maKhoanThuPhong: row?.maKhoanThuPhong?.toString() || row?.['Mã khoản thu phòng']?.toString() || '',
							maKhoanThuCoc: row?.maKhoanThuCoc?.toString() || row?.['Mã khoản thu cọc']?.toString() || '',
							isChoThue: row?.isChoThue === true || String(row?.isChoThue).toLowerCase() === 'true' || row?.isChoThue === 1 || row?.['Cho thuê'] === 'Có' || row?.['Cho thuê'] === true,
							gioiTinh: row?.gioiTinh?.toString() || row?.['Giới tính']?.toString() || 'Nam',
							maxPerKhoa: Number(row?.maxPerKhoa ?? row?.['Số lượng tối đa mỗi khoa'] ?? 0),
							minAge: Number(row?.minAge ?? row?.['Độ tuổi tối thiểu'] ?? 0),
							maxAge: Number(row?.maxAge ?? row?.['Độ tuổi tối đa'] ?? 0),
						})).filter((item: any) => item.ma);

						await axios.post(`${ipCsvc}/phong/ktx/import`, payload);
						onSuccess('Ok');
						message.success('Nhập dữ liệu thành công');
						getModel();
					} catch (err) {
						onError(err);
						message.error('Lỗi khi nhập dữ liệu');
					}
				};
				reader.readAsArrayBuffer(file);
			} else {
				onError(new Error('FileReader not supported'));
				message.error('Trình duyệt không hỗ trợ đọc file');
			}
		}
	};

	const customButtons = [
		<Upload key='upload' {...uploadProps}>
			<ButtonExtend className='btn-import' icon={<ImportOutlined />}>
				Nhập dữ liệu
			</ButtonExtend>
		</Upload>,
		<ButtonExtend
			key='export'
			className='btn-export'
			icon={<ExportOutlined />}
			onClick={handleExport}
			loading={exporting}
		>
			Xuất dữ liệu
		</ButtonExtend>
	];

	const columns: IColumn<KyTucXa.IPhongKTX>[] = [
		{
			title: 'Mã phòng',
			dataIndex: 'ma',
			width: 100,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Tên phòng',
			dataIndex: 'ten',
			width: 150,
			sortable: true,
		},
		{
			title: 'Tòa nhà',
			dataIndex: 'maToaNha',
			width: 120,
		},
		{
			title: 'Sức chứa',
			dataIndex: 'soLuongToiDa',
			align: 'center',
			width: 100,
		},
		{
			title: 'Đang ở',
			dataIndex: 'soLuongHienTai',
			align: 'center',
			width: 100,
		},
		{
			title: 'Giới tính',
			dataIndex: 'maGioiTinh',
			align: 'center',
			width: 100,
		},
		{
			title: 'Tên khoản thu phòng',
			dataIndex: 'maKhoanThuPhong',
			width: 130,
			render: (val) => danhSachKhoanThu?.find((item: any) => item?._id === val)?.ten || val,
		},
		{
			title: 'Tên khoản thu cọc',
			dataIndex: 'maKhoanThuCoc',
			width: 130,
			render: (val) => danhSachKhoanThu?.find((item: any) => item?._id === val)?.ten || val,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa phòng ký túc xá này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='kytucxa.phong'
			title="Phòng"
			Form={Form}
			rowSelection
			deleteMany
			otherButtons={customButtons}
			buttons={{ create: false }}
		/>
	);
};

export default PhongKTXPage;
