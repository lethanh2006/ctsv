import ImportExcel from '@/components/ImportExcel';
import { Button, Input, Modal, Space, Table, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const extractMaSinhVien = (rows: any[]) =>
	rows.map((row) => String(row?.[0] ?? '').trim()).filter((maSinhVien) => !!maSinhVien);

const SinhVienDangKySection = (props: { dotId?: string; visible?: boolean }) => {
	const { dotId, visible } = props;
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [importOpen, setImportOpen] = useState(false);
	const [manualValue, setManualValue] = useState('');

	const loadData = async () => {
		if (!dotId) return;
		setLoading(true);
		try {
			const response: any = await getDotSinhVienDangKyKTX(dotId);
			setDanhSachSinhVien(response?.data ?? response ?? []);
		} catch (error) {
			message.error('Không tải được danh sách sinh viên đăng ký');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (visible && dotId) loadData();
		if (!visible) {
			setManualValue('');
			setImportOpen(false);
		}
	}, [visible, dotId]);

	const currentMaSinhVien = useMemo(
		() =>
			danhSachSinhVien
				.map((item) => String(item?.maSinhVien ?? item?.ma ?? item?.sinhVien?.ma ?? '').trim())
				.filter((maSinhVien) => !!maSinhVien),
		[danhSachSinhVien],
	);

	const submitDanhSach = async (danhSachMaSinhVien: string[]) => {
		if (!dotId) {
			message.warning('Vui lòng lưu đợt trước khi quản lý danh sách sinh viên');
			return;
		}
		const uniqueDanhSach = Array.from(new Set(danhSachMaSinhVien.filter((maSinhVien) => !!maSinhVien)));
		if (!uniqueDanhSach.length) {
			message.warning('Vui lòng nhập ít nhất 1 MSSV');
			return;
		}
		const danhSachKhongTrung = uniqueDanhSach.filter((maSinhVien) => !currentMaSinhVien.includes(maSinhVien));
		if (!danhSachKhongTrung.length) {
			message.info('Danh sách đã có đầy đủ các MSSV này');
			return;
		}
		try {
			await postDotSinhVienDangKyKTX(dotId, { danhSachMaSinhVien: danhSachKhongTrung });
			message.success('Đã thêm sinh viên vào đợt');
			setManualValue('');
			await loadData();
		} catch (error) {
			message.error('Không thêm được sinh viên vào đợt');
		}
	};

	const handleImportData = async (rows: any[]) => {
		await submitDanhSach(extractMaSinhVien(rows));
		setImportOpen(false);
	};

	const handleDelete = async (record: any) => {
		if (!dotId || !record?._id) return;
		try {
			await deleteDotSinhVienDangKyKTX(dotId, record._id);
			message.success('Đã xóa sinh viên khỏi đợt');
			await loadData();
		} catch (error) {
			message.error('Không xóa được sinh viên khỏi đợt');
		}
	};

	return (
		<div style={{ marginTop: 16 }}>
			<div style={{ fontWeight: 600, marginBottom: 8 }}>Danh sách sinh viên được đăng ký</div>
			<Space direction='vertical' style={{ width: '100%' }} size={12}>
				<Space wrap>
					<Button onClick={() => setImportOpen(true)} type='primary'>
						Import file Excel
					</Button>
					<Input.Search
						allowClear
						placeholder='Nhập MSSV, ngăn cách bằng dấu phẩy hoặc xuống dòng'
						style={{ width: 380 }}
						value={manualValue}
						onChange={(event) => setManualValue(event.target.value)}
						onSearch={() => submitDanhSach(manualValue.split(/[\n,;]+/).map((item) => item.trim()))}
					/>
				</Space>
				<div>Tổng số: {danhSachSinhVien.length}</div>
				<Table
					rowKey={(record) => record?._id ?? record?.maSinhVien ?? record?.ma}
					loading={loading}
					pagination={{ pageSize: 10, showSizeChanger: false }}
					dataSource={danhSachSinhVien}
					columns={[
						{
							title: '#',
							width: 60,
							render: (_value, _record, index) => index + 1,
						},
						{
							title: 'MSSV',
							dataIndex: 'maSinhVien',
							render: (_value, record) => record?.maSinhVien ?? record?.ma ?? record?.sinhVien?.ma ?? '--',
						},
						{
							title: 'Họ tên',
							dataIndex: 'hoTen',
							render: (_value, record) => record?.hoTen ?? record?.tenSinhVien ?? record?.sinhVien?.ten ?? '--',
						},
						{
							title: 'Khóa',
							dataIndex: 'maKhoaSinhVien',
							render: (_value, record) => record?.maKhoaSinhVien ?? record?.khoaSinhVien?.ma ?? '--',
						},
						{
							title: 'Xóa',
							width: 100,
							render: (_value, record) => (
								<Button danger type='link' onClick={() => handleDelete(record)}>
									Xóa
								</Button>
							),
						},
					]}
				/>
			</Space>

			<Modal open={importOpen} onCancel={() => setImportOpen(false)} footer={null} destroyOnClose width={720}>
				<ImportExcel onCancel={() => setImportOpen(false)} handleData={handleImportData} title='Import MSSV vào đợt' />
			</Modal>
		</div>
	);
};

export default SinhVienDangKySection;
