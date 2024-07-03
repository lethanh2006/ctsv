import { useModel } from '@@/plugin-model/useModel';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';
import { Button, Form, message, Modal, Popconfirm, Space, Spin, Tabs } from 'antd';
import { DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { useState } from 'react';
import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { importDanhSachSinhVien, importDanhSachSinhVienThamGia } from '@/services/HoatDongChung';
import formWaiting from '@/components/Loading/FormWaiting';

interface IProps {
	hoatDongCtsvId: string;
}

enum TrangThaiThamGia {
	THAM_GIA = 'Tham gia',
	KHONG_THAM_GIA = 'Không tham gia',
}
const DanhSachSinhVien = (props: IProps) => {
	const { hoatDongCtsvId } = props;
	const { getModel, condition, page, limit, loading, deleteModel } = useModel('danhsachsinhvienhoatdong');
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [currentTabs, setCurrentTabs] = useState<string>('dang-ky');

	const getData = async () => {
		try {
			getModel({
				hoatDongCtsvId: hoatDongCtsvId,
				trangThaiThamGia: currentTabs === 'tham-gia' ? TrangThaiThamGia.THAM_GIA : undefined,
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleImportData = async (id: string, file: any) => {
		try {
			formWaiting('Hệ thống đang xử lý');
			const res = await importDanhSachSinhVien(id, file);
			if (res) {
				message.success('Nhập dữ liệu thành công');
				getData();
			}
		} catch (e) {
			console.log(e);
		} finally {
			Modal.destroyAll();
		}
	};

	const handleImportDataThamGia = async (id: string, file: any) => {
		try {
			formWaiting('Hệ thống đang xử lý');
			const res = await importDanhSachSinhVienThamGia(id, 'Tham gia', file);
			if (res) {
				message.success('Nhập dữ liệu thành công');
				getData();
			}
		} catch (e) {
			console.log(e);
		} finally {
			Modal.destroyAll();
		}
	};

	const column: IColumn<HoatDongChung.DanhSachSinhVienThamGia>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: 'ma',
			width: 150,
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Họ và tên',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Mã ngành',
			dataIndex: 'maNganh',
			width: 150,
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Tên ngành',
			dataIndex: 'tenNganh',
			width: 250,
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Thao tác',
			width: 80,
			align: 'center',
			fixed: 'right',
			render: (rec) => (
				<Popconfirm
					title='Bạn có chắc chắn xóa sinh viên khỏi danh sách?'
					onConfirm={() => deleteModel(rec._id, getData)}
				>
					<Button type='link' icon={<DeleteOutlined />} danger />
				</Popconfirm>
			),
		},
	];

	return (
		<>
			<Spin spinning={loading}>
				<TableBase
					hideCard
					getData={getData}
					dependencies={[condition, limit, page, hoatDongCtsvId, currentTabs]}
					modelName={'danhsachsinhvienhoatdong'}
					columns={column}
					title='Danh sách sinh viên'
					buttons={{ create: false }}
					otherButtons={[
						<>
							<ButtonExtend
								type='primary'
								icon={<ImportOutlined />}
								onClick={() => {
									setVisibleImport(true);
								}}
							>
								Nhập dữ liệu
							</ButtonExtend>
						</>,
					]}
				>
					<Tabs
						activeKey={currentTabs}
						onChange={(val) => {
							setCurrentTabs(val);
						}}
					>
						<Tabs.TabPane tab='Danh sách sinh viên thuộc diện phải tham gia' key='dang-ky' />
						<Tabs.TabPane tab='Danh sách sinh viên tham gia' key='tham-gia' />
					</Tabs>
				</TableBase>
			</Spin>
			<Modal
				visible={visibleImport}
				onCancel={() => {
					setVisibleImport(false);
				}}
				title='Nhập dữ liệu'
				footer={null}
				destroyOnClose
			>
				<Form
					onFinish={(values: any) => {
						try {
							if (currentTabs === 'dang-ky') {
								handleImportData(hoatDongCtsvId, values?.file?.fileList?.[0]?.originFileObj);
							} else {
								handleImportDataThamGia(hoatDongCtsvId, values?.file?.fileList?.[0]?.originFileObj);
							}
						} catch (e) {
							console.log(e);
						}
					}}
				>
					<Form.Item name='file' rules={[...rules.required, ...rules.fileRequired]}>
						<UploadFile accept='.xlsx' drag />
					</Form.Item>
					<div className='form-footer'>
						<Form.Item>
							<Space>
								<Button type={'primary'} htmlType='submit'>
									Lưu dữ liệu
								</Button>
								<Button
									onClick={() => {
										setVisibleImport(false);
									}}
								>
									Đóng
								</Button>
							</Space>
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	);
};
export default DanhSachSinhVien;
