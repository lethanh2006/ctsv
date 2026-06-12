import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { ImportOutlined } from '@ant-design/icons';
import { Button, Card, Form, Modal, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import fileDownload from 'js-file-download';

const SinhVienDangKySection = (props: { form: FormInstance; dotId?: string; visible?: boolean }) => {
	const { form, visible } = props;
	const [visibleSelect, setVisibleSelect] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

	useEffect(() => {
		if (visible) {
			setSelectedUsers([]);
		}
	}, [visible]);

	const customImportConfig = {
		onDownloadTemplate: () => {
			const headers = [['TT', 'Mã sinh viên', 'Họ tên', 'Khoá sinh viên']];
			const worksheet = XLSX.utils.aoa_to_sheet(headers);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Mẫu');
			const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			fileDownload(blob, 'Mẫu nhập danh sách sinh viên.xlsx');
		},
		onImport: (file: File): Promise<any[]> => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					try {
						const data = e.target?.result;
						const workbook = XLSX.read(data, { type: 'array' });
						const ws = workbook.Sheets[workbook.SheetNames[0]];
						const sheetData: any[] = XLSX.utils.sheet_to_json(ws);
						const parsed = sheetData.map((row: any) => {
							const code = row['Mã sinh viên']?.toString()?.trim() || '';
							const fullname = row['Họ tên']?.toString()?.trim() || '';
							const khoa = row['Khoá sinh viên']?.toString()?.trim() || '';
							return {
								code,
								username: code,
								fullname,
								khoaSinhVien: khoa,
								vaiTro: EVaiTroKhaoSat.SINH_VIEN,
							};
						}).filter((item) => item.code);
						resolve(parsed);
					} catch (err) {
						reject(err);
					}
				};
				reader.onerror = (err) => reject(err);
				reader.readAsArrayBuffer(file);
			});
		},
	};

	return (
		<Card title={'Danh sách sinh viên đăng ký KTX'} className='form-card' style={{ marginTop: 12 }}>
			<Form.Item name='danhSach' label='Chọn sinh viên' help='Chọn nhiều sinh viên (tìm theo họ tên hoặc mã)'>
				<SelectSinhVienDebounce multiple selectMa />
			</Form.Item>

			<div style={{ marginTop: 8 }}>
				<Button onClick={() => setVisibleSelect(true)} icon={<ImportOutlined />} style={{ width: '100%' }}>
					Nhập danh sách sinh viên
				</Button>
			</div>

			<Modal
				open={visibleSelect}
				onCancel={() => setVisibleSelect(false)}
				title={'Chọn/nhập danh sách sinh viên'}
				width={900}
				footer={null}
				destroyOnClose
			>
				<TableSelectUser
					type={EVaiTroKhaoSat.SINH_VIEN}
					selectedUsers={selectedUsers}
					setSelectedUsers={(val: any) => setSelectedUsers(val)}
					customImport={customImportConfig}
					customStudentColumn={{
						title: 'Khoá sinh viên',
						dataIndex: 'khoaSinhVien',
					}}
				/>
				<div style={{ textAlign: 'right', marginTop: 12 }}>
					<Button
						onClick={() => {
							const codes = (selectedUsers ?? []).map((u: any) => u.code).filter(Boolean);
							form.setFieldsValue({ danhSach: codes });
							setVisibleSelect(false);
						}}
						type='primary'
					>
						Chọn xong
					</Button>
				</div>
			</Modal>
		</Card>
	);
};

export default SinhVienDangKySection;
