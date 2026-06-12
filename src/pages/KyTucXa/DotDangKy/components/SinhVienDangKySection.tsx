import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { ImportOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Form, Modal, Table, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import fileDownload from 'js-file-download';
import { useModel } from 'umi';
import { EOperatorType } from '@/components/Table/constant';

const SinhVienDangKySection = (props: { form: FormInstance; dotId?: string; visible?: boolean }) => {
	const { form, visible } = props;
	const [visibleSelect, setVisibleSelect] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
	const { getModel: getSinhVienModel } = useModel('daotaov2.sinhvien.sinhvien');

	useEffect(() => {
		if (!visible) {
			setSelectedUsers([]);
			return;
		}

		const codes = form.getFieldValue('danhSach') || [];
		if (codes.length > 0) {
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
						username: item.ma,
						fullname: item.ten,
						khoaSinhVien: item.khoaSinhVien?.ten || item.khoaSinhVien?.ma || '',
						vaiTro: EVaiTroKhaoSat.SINH_VIEN,
					}));
					// Merge with any codes that weren't found in DB
					const fetchedCodes = fetchedUsers.map((u) => u.code);
					const missingUsers = codes
						.filter((code: string) => !fetchedCodes.includes(code))
						.map((code: string) => ({
							code,
							username: code,
							fullname: '',
							khoaSinhVien: '',
							vaiTro: EVaiTroKhaoSat.SINH_VIEN,
						}));
					
					setSelectedUsers([...fetchedUsers, ...missingUsers]);
				})
				.catch((err) => {
					console.error(err);
					setSelectedUsers(codes.map((code: string) => ({
						code,
						username: code,
						fullname: '',
						khoaSinhVien: '',
						vaiTro: EVaiTroKhaoSat.SINH_VIEN,
					})));
				});
		} else {
			setSelectedUsers([]);
		}
	}, [form, visible]);

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
						const parsed = sheetData
							.map((row: any) => {
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
							})
							.filter((item) => item.code);
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
				}}
			>
				<div>
					<span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1f1f1f' }}>
						Danh sách sinh viên đăng ký KTX
					</span>
					{selectedUsers?.length > 0 && (
						<span style={{ marginLeft: 12, color: '#555' }}>
							(Đã chọn: <strong style={{ color: '#1890ff' }}>{selectedUsers.length}</strong> sinh viên)
						</span>
					)}
				</div>
				<Button onClick={() => setVisibleSelect(true)} icon={<ImportOutlined />} type='primary'>
					Nhập danh sách sinh viên
				</Button>
			</div>

			{selectedUsers?.length > 0 && (
				<Table
					dataSource={selectedUsers}
					columns={columns}
					rowKey="code"
					size="small"
					pagination={{ pageSize: 10 }}
					bordered
					style={{ marginTop: 12 }}
				/>
			)}

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
					singleTable={true}
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
		</div>
	);
};

export default SinhVienDangKySection;
