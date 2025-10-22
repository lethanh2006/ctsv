import formWaiting from '@/components/Loading/FormWaiting';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import { importDanhSachSinhVien, importDanhSachSinhVienThamGia } from '@/services/HoatDongChung';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';
import rules from '@/utils/rules';
import { useModel } from 'umi';
import { DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import { Button, Form, message, Modal, Popconfirm, Space, Spin, Tabs } from 'antd';
import { useCallback, useState } from 'react';
import FormDanhSachSinhVien from './FormDanhSachSinhVien';
import { TrangThaiThamGia } from '@/services/HoatDongChung/constants';

interface IProps {
	hoatDongCtsvId: string;
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

	const FormSV = useCallback(
		() => <FormDanhSachSinhVien trangThai={currentTabs} hoatDongCtsvId={props.hoatDongCtsvId} getData={getData} />,
		[props.hoatDongCtsvId, currentTabs],
	);

	return (
		<>
			<Spin spinning={loading}>
				<TableBase
					params={{ hoatDongCtsvId: props.hoatDongCtsvId }}
					Form={FormSV}
					hideCard
					getData={getData}
					dependencies={[condition, limit, page, hoatDongCtsvId, currentTabs]}
					modelName={'danhsachsinhvienhoatdong'}
					columns={column}
					title='Danh sách sinh viên'
					buttons={{ create: true, export: true }}
					otherButtons={[
						<>
							<ButtonExtend
								// type='primary'
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
				open={visibleImport}
				onCancel={() => {
					setVisibleImport(false);
				}}
				title='Nhập dữ liệu'
				footer={null}
				destroyOnHidden
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
					<Form.Item
						extra={
							<div>
								Xem file mẫu{' '}
								<a
									target='_blank'
									href='https://ais.aisenote.com/slink/file/6686d9120b258de8a715f4f9/DSSV.xlsx'
									rel='noreferrer'
								>
									tại đây
								</a>
							</div>
						}
						name='file'
						rules={[...rules.required, ...rules.fileRequired]}
					>
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
