import { Button, Col, Form, Input, message, Modal, Row, Select, Spin, Tooltip } from 'antd';

import { useState } from 'react';
import { useModel } from 'umi';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import ImportExcel from '@/components/ImportExcel';
import rules from '@/utils/rules';
import type { QuyTrinh } from '@/services/QuyTrinhDong/typings';
import SelectQuyTrinh from '@/pages/QuyTrinhDong/QuanLyQuyTrinh/Select';
import { chuyenVienTiepNhanImport } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/khaibaoquytrinh';
import { TrangThaiTiepNhanDon } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import SelectVanBan from '@/pages/QuyTrinhDong/QuanLyVanBan/Select';
const { TextArea } = Input;
const FormTiepNhanNhieuDon = (props: { handleCancel: () => void }) => {
	const { handleCancel } = props;
	const { danhSach } = useModel('quytrinh.quanlyquytrinh');
	const [curentQuyTrinhSelect, setCurentQuyTrinhSelect] = useState<QuyTrinh.IRecord>();
	const [maFormKhaiBaoSelect, setMaFormKhaiBaoSelect] = useState<string>();
	const [visibleThamChieu, setVisbleThamChieu] = useState<boolean>(false);
	const [editThamChieu, setEditThamChieu] = useState<boolean>(false);
	const [loadingDuyet, setLoadingDuyet] = useState<boolean>(false);
	const [recordThamChieu, setRecordThamChieu] = useState<any>();
	const [dataDanhSachThamChieu, setDataDanhSachThamChieu] = useState<any[]>([]);
	const [ImportExcelType, setImportExcelType] = useState<string>('');
	const [currentTypeDuyet, setCurrentTypeDuyet] = useState<string>('');
	const [visible, setVisible] = useState<boolean>(false);
	const onFinish = async (values: any) => {
		try {
			if (dataDanhSachThamChieu?.length < 1) {
				message.warning('Vui lòng thêm danh sách tham chiếu đơn');
				return;
			}
			setLoadingDuyet(true);
			const payload = {
				...values,
				danhSachThamChieu: dataDanhSachThamChieu?.map((val) => val?.ten),
			};
			const res = await chuyenVienTiepNhanImport(payload);
			if (res) {
				message.success('Tiếp nhận thành công');
				handleCancel();
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingDuyet(false);
		}
	};
	const columns: IColumn<any>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 150,
		},
		{
			title: 'Thao tác',
			width: 150,
			align: 'center',
			render: (recordVal) => {
				return (
					<>
						<Tooltip title='Chỉnh sửa'>
							<Button
								onClick={() => {
									setRecordThamChieu(recordVal);
									setEditThamChieu(true);
									setVisbleThamChieu(true);
									// history.push(`/quan-ly-khoa-hoc/khai-bao-quy-trinh/${recordVal?._id}`);
								}}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Xoá'>
							<Button
								onClick={() => {
									if (dataDanhSachThamChieu) {
										setDataDanhSachThamChieu(dataDanhSachThamChieu?.filter((item) => item?.id !== recordVal?.id));
									}
									// history.push(`/quan-ly-khoa-hoc/khai-bao-quy-trinh/${recordVal?._id}`);
								}}
								danger
								type='link'
								icon={<DeleteOutlined />}
							/>
						</Tooltip>
					</>
				);
			},
		},
	];
	const handleData = (newData: any[]) => {
		const oldData = [...dataDanhSachThamChieu];
		const data = {};
		// @ts-ignore
		data[ImportExcelType] = _.union(
			oldData,
			newData
				?.filter((item) => item?.[0] !== null && item?.[0] !== undefined)
				?.map((item: any[]) =>
					typeof item?.[0] === 'string'
						? { id: nanoid(), ten: item?.[0]?.trim() ?? '' }
						: { id: nanoid(), ten: item?.[0] },
				),
		);

		// form.setFieldsValue(data);
		// @ts-ignore
		setDataDanhSachThamChieu(data?.[ImportExcelType]);
		setVisible(false);
	};
	return (
		<>
			<Spin spinning={loadingDuyet}>
				<Form layout={'vertical'} onFinish={onFinish}>
					<Row>
						<Col span={24}>
							<Form.Item name={'quyTrinhId'} label={'Quy trình'} rules={[...rules.required]}>
								<SelectQuyTrinh
									allowClear
									onChange={(val: any) => {
										const obj = danhSach?.find((item) => item?._id === val);
										setCurentQuyTrinhSelect(obj);
									}}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name={'maBuoc'} label={'Bước'} rules={[...rules.required]}>
								<Select
									placeholder={'Chọn bước'}
									style={{ width: '100%' }}
									allowClear
									onChange={(val) => {
										const obj = curentQuyTrinhSelect?.danhSachBuocXuLy?.find((item) => item.ma === val);
										if (obj) {
											setMaFormKhaiBaoSelect(obj?.maFormKhaiBao);
										}
										// setCondition({
										//   ...condition,
										//   maBuoc: val,
										// });
									}}
									notFoundContent={'Vui lòng chọn quy trình trước'}
									options={curentQuyTrinhSelect?.danhSachBuocXuLy?.map((val) => {
										return {
											value: val?.ma,
											label: val?.ten,
										};
									})}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name={'trangThaiTiepNhan'} label={'Kết quả tiếp nhận'} rules={[...rules.required]}>
								<Select
									placeholder={'Chọn trạng thái'}
									style={{ width: '100%' }}
									allowClear
									onChange={(val) => {
										setCurrentTypeDuyet(val);
									}}
									options={Object.values(TrangThaiTiepNhanDon)?.map((val) => {
										return {
											value: val,
											label: val,
										};
									})}
								/>
							</Form.Item>
						</Col>
						{currentTypeDuyet === TrangThaiTiepNhanDon.DUYET && (
							<Col span={24}>
								<Form.Item
									label={'Văn bản đính kèm'}
									name={'maVanBan'}
									rules={currentTypeDuyet !== TrangThaiTiepNhanDon.DUYET ? [...rules.required] : []}
								>
									<SelectVanBan dataState={'ma'} hasCreate />
								</Form.Item>
							</Col>
						)}
						<Col span={24}>
							<Form.Item name={'ghiChu'} label={'Ghi chú'}>
								<TextArea rows={4} placeholder={'Nhập ghi chú'} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name={'quyTrinhId'} label={'Danh sách tham chiếu đơn'}>
								<TableStaticData
									setShowEdit={() => {
										setVisbleThamChieu(true);
									}}
									data={dataDanhSachThamChieu}
									columns={columns}
									hasCreate={true}
								>
									<Button
										onClick={() => {
											setVisible(true);
											setImportExcelType('MaThanToan');
										}}
									>
										Nhập dữ liệu
									</Button>
								</TableStaticData>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name={'maTruongThamChieu'} label={'Trường thông tin tham chiếu'} rules={[...rules.required]}>
								<Select
									placeholder={'Chọn trường thông tin'}
									style={{ width: '100%' }}
									allowClear
									onChange={(val) => {
										// setCondition({
										//   ...condition,
										//   maBuoc: val,
										// });
									}}
									notFoundContent={'Vui lòng chọn bước'}
									options={curentQuyTrinhSelect?.danhSachFormKhaiBao
										?.find((item) => item?.ma === maFormKhaiBaoSelect)
										?.cauHinhLoaiHinh?.map((val) => {
											return {
												value: val?.ma,
												label: val?.ten,
											};
										})}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
										Tiếp nhận
									</Button>
									<Button
										onClick={() => {
											handleCancel();
										}}
									>
										Đóng
									</Button>
								</div>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>

			<Modal
				title={'Thêm mới'}
				open={visibleThamChieu}
				onCancel={() => setVisbleThamChieu(false)}
				width={800}
				// footer={
				// 	<>
				// 		<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				// 	</>
				// }
				destroyOnHidden
				footer={null}
			>
				<Form
					onFinish={async (values: any) => {
						try {
							const arr = [...dataDanhSachThamChieu];
							if (editThamChieu) {
								const obj = arr.find((item) => item?.id === recordThamChieu?.id);
								if (obj) {
									const obj2 = {
										...recordThamChieu,
										ten: values?.ten,
									};
									arr?.forEach((item, i) => {
										if (item?.id === recordThamChieu?.id) {
											arr?.splice(i, 1, obj2);
										}
									});
									setDataDanhSachThamChieu(arr);
								}
							} else {
								arr.push({ ...values, id: nanoid() });
								setDataDanhSachThamChieu(arr);
							}

							setVisbleThamChieu(false);
						} catch (e) {
							console.log(e);
						}
					}}
					initialValues={editThamChieu ? recordThamChieu : undefined}
				>
					<Form.Item label={'Tên'} name={'ten'}>
						<Input placeholder={'Nhập tên'} />
					</Form.Item>
					<Form.Item>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
								Thêm mới
							</Button>
							<Button onClick={() => setVisbleThamChieu(false)}>Đóng</Button>
						</div>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				footer={false}
				open={visible}
				styles={{ padding: 0 }}
				onCancel={() => {
					setVisible(false);
				}}
				destroyOnHidden
			>
				<ImportExcel
					handleData={handleData}
					title={'Import '}
					onCancel={() => {
						setVisible(false);
					}}
				/>
			</Modal>
		</>
	);
};
export default FormTiepNhanNhieuDon;
