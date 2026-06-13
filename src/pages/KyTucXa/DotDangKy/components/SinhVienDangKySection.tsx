import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { ImportOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Table, message, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import fileDownload from 'js-file-download';
import { useModel } from 'umi';

const SinhVienDangKySection = (props: { form: FormInstance; dotId?: string; visible?: boolean }) => {
	const { form, visible, dotId } = props;
	const [visibleSelect, setVisibleSelect] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const { getSinhVienDangKy, deleteSinhVienDangKy } = useModel('kytucxa.dotdangkyktx');

	const fetchStudents = async () => {
		if (!dotId) return;
		setLoading(true);
		try {
			const res = await getSinhVienDangKy(dotId);
			const rawData = res?.data?.data?.result || res?.data?.data || res?.data || [];
			const data = Array.isArray(rawData) ? rawData : [];
			const list = data.map((item: any) => ({
				_id: item._id,
				code: item.maSinhVien || item.ma || '',
				username: item.maSinhVien || item.ma || '',
				fullname: item.hoTen || item.fullname || item.tenSinhVien || '',
				khoaSinhVien: item.khoaSinhVien || '',
				vaiTro: EVaiTroKhaoSat.SINH_VIEN,
			}));
			const uniqueList = list.filter((item, index, self) =>
				item.code && self.findIndex((t) => t.code === item.code) === index
			);
			setSelectedUsers(uniqueList);
			form.setFieldsValue({
				danhSach: uniqueList.map((u) => ({
					maSinhVien: u.code,
					hoTen: u.fullname || '',
					khoaSinhVien: u.khoaSinhVien || '',
				}))
			});
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!visible) {
			setSelectedUsers([]);
			return;
		}

		if (dotId) {
			fetchStudents();
		} else {
			setSelectedUsers([]);
			form.setFieldsValue({ danhSach: [] });
		}
	}, [dotId, visible]);

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

	const onDelete = async (record: any) => {
		if (dotId && record._id) {
			try {
				await deleteSinhVienDangKy(dotId, record._id);
				message.success('Xóa sinh viên thành công');
				fetchStudents();
			} catch (err) {
				console.error(err);
				message.error('Không thể xóa sinh viên');
			}
		} else {
			const nextUsers = selectedUsers.filter((u) => u.code !== record.code);
			setSelectedUsers(nextUsers);
			form.setFieldsValue({
				danhSach: nextUsers.map((u) => ({
					maSinhVien: u.code,
					hoTen: u.fullname || '',
					khoaSinhVien: u.khoaSinhVien || '',
				}))
			});
		}
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
					onClick={() => onDelete(record)}
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

			{(selectedUsers?.length > 0 || loading) && (
				<Table
					dataSource={selectedUsers}
					columns={columns}
					rowKey="code"
					size="small"
					pagination={{ pageSize: 10 }}
					bordered
					loading={loading}
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
					setSelectedUsers={(val: any) => {
						const normalized = (val || []).map((u: any) => {
							const code = u.code || u.username || u.maSinhVien || '';
							return {
								...u,
								code,
								username: code,
							};
						});
						const unique = normalized.filter((item: any, index: number, self: any[]) =>
							item.code && self.findIndex((t) => t.code === item.code) === index
						);
						setSelectedUsers(unique);
					}}
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
							const nextList = (selectedUsers ?? []).map((u: any) => ({
								maSinhVien: u.code,
								hoTen: u.fullname || '',
								khoaSinhVien: u.khoaSinhVien || '',
							})).filter((item) => item.maSinhVien);
							form.setFieldsValue({ danhSach: nextList });
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
