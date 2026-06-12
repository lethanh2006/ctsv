import { ImportOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Table, Upload, message, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import fileDownload from 'js-file-download';
import { useModel } from 'umi';
import { EOperatorType } from '@/components/Table/constant';

const SinhVienDangKySection = (props: { form: FormInstance; dotId?: string; visible?: boolean }) => {
	const { form, visible } = props;
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
	const [importing, setImporting] = useState<boolean>(false);
	const { getModel: getSinhVienModel } = useModel('daotaov2.sinhvien.sinhvien');

	useEffect(() => {
		if (!visible) {
			setSelectedUsers([]);
			return;
		}

		const codes = form.getFieldValue('danhSach') || [];
		if (codes.length > 0) {
			setImporting(true);
			getSinhVienModel(
				undefined,
				[
					{
						active: true,
						field: 'ma',
						values: codes,
						operator: EOperatorType.INCLUDE,
					},
				],
				undefined,
				1,
				codes.length,
			)
				.then((res: any[]) => {
					const fetchedUsers = (res ?? []).map((item) => ({
						code: item.ma,
						fullname: item.ten,
						khoaSinhVien: item.khoaSinhVien?.ten || item.khoaSinhVien?.ma || '',
					}));
					// Merge with any codes that weren't found in DB
					const fetchedCodes = fetchedUsers.map((u) => u.code);
					const missingUsers = codes
						.filter((code: string) => !fetchedCodes.includes(code))
						.map((code: string) => ({ code, fullname: '', khoaSinhVien: '' }));
					
					setSelectedUsers([...fetchedUsers, ...missingUsers]);
				})
				.catch((err) => {
					console.error(err);
					setSelectedUsers(codes.map((code: string) => ({ code, fullname: '', khoaSinhVien: '' })));
				})
				.finally(() => setImporting(false));
		} else {
			setSelectedUsers([]);
		}
	}, [form, visible]);

	const onDownloadTemplate = () => {
		const headers = [['TT', 'Mã sinh viên', 'Họ tên', 'Khoá sinh viên']];
		const worksheet = XLSX.utils.aoa_to_sheet(headers);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Mẫu');
		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		fileDownload(blob, 'Mẫu nhập danh sách sinh viên.xlsx');
	};

	const onImport = (file: File) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = e.target?.result;
				const workbook = XLSX.read(data, { type: 'array' });
				const ws = workbook.Sheets[workbook.SheetNames[0]];
				const sheetData: any[] = XLSX.utils.sheet_to_json(ws);
				
				const parsed = sheetData
					.map((row: any) => {
						const code = row['Mã sinh viên']?.toString()?.trim() || '';
						const fullname = row['Họ tên']?.toString()?.trim() || '';
						const khoa = row['Khoá sinh viên']?.toString()?.trim() || '';
						return {
							code,
							fullname,
							khoaSinhVien: khoa,
						};
					})
					.filter((item) => item.code);

				if (parsed.length === 0) {
					message.error('File import không chứa dữ liệu hợp lệ');
					return;
				}

				const mergedUsers = [...selectedUsers, ...parsed];
				const uniqueUsers = mergedUsers.filter(
					(user, index, self) => self.findIndex((u) => u.code === user.code) === index,
				);

				setSelectedUsers(uniqueUsers);
				form.setFieldsValue({ danhSach: uniqueUsers.map((u) => u.code) });
				message.success(`Đã nhập thành công ${parsed.length} sinh viên`);
			} catch (err) {
				console.error(err);
				message.error('Có lỗi xảy ra khi xử lý file Excel');
			}
		};
		reader.readAsArrayBuffer(file);
		return false; // Prevent auto-upload
	};

	const onDelete = (code: string) => {
		const nextUsers = selectedUsers.filter((u) => u.code !== code);
		setSelectedUsers(nextUsers);
		form.setFieldsValue({ danhSach: nextUsers.map((u) => u.code) });
	};

	const columns = [
		{
			title: 'STT',
			key: 'index',
			width: 60,
			align: 'center' as const,
			render: (text: any, record: any, index: number) => index + 1,
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'code',
			key: 'code',
			width: 150,
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullname',
			key: 'fullname',
		},
		{
			title: 'Khóa sinh viên',
			dataIndex: 'khoaSinhVien',
			key: 'khoaSinhVien',
			width: 150,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 80,
			align: 'center' as const,
			render: (text: any, record: any) => (
				<Button
					type="link"
					danger
					icon={<DeleteOutlined />}
					onClick={() => onDelete(record.code)}
				/>
			),
		},
	];

	return (
		<div style={{ marginTop: 12 }}>
			<Form.Item name='danhSach' noStyle>
				<input type='hidden' />
			</Form.Item>

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '12px 16px',
					background: '#f5f5f5',
					border: '1px solid #d9d9d9',
					borderRadius: '8px',
					marginBottom: 12,
				}}
			>
				<div>
					<span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1f1f1f' }}>
						Danh sách sinh viên đăng ký KTX
					</span>
					{selectedUsers?.length > 0 && (
						<span style={{ marginLeft: 12, color: '#555' }}>
							(Đã nhập: <strong style={{ color: '#1890ff' }}>{selectedUsers.length}</strong> sinh viên)
						</span>
					)}
				</div>
				<div style={{ display: 'flex', gap: 8 }}>
					<Button icon={<DownloadOutlined />} onClick={onDownloadTemplate}>
						Tải file mẫu
					</Button>
					<Upload accept=".xls,.xlsx" showUploadList={false} beforeUpload={onImport}>
						<Button icon={<ImportOutlined />} type='primary'>
							Nhập từ Excel
						</Button>
					</Upload>
				</div>
			</div>

			<Table
				dataSource={selectedUsers}
				columns={columns}
				rowKey="code"
				size="small"
				pagination={{ pageSize: 10 }}
				bordered
				loading={importing}
				locale={{ emptyText: 'Chưa có sinh viên nào trong danh sách. Vui lòng tải file mẫu và nhập từ Excel.' }}
			/>
		</div>
	);
};

export default SinhVienDangKySection;
