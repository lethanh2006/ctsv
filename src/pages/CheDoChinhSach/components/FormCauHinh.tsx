import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

import rules from '@/utils/rules';
import { removeVietnameseTones } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Checkbox,
	Col,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Popover,
	Radio,
	Row,
	Select,
	Space,
	Tooltip,
	message,
} from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormCot from './FormCot';

import JsonEditor from '@/components/JsonEditor';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';

import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { EKieuDuLieu, ETextDisplay, MapKeyNameTextDisplay } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { LoaiDefaultValue } from '@/services/QuyTrinhDong/constant';
import FormGiaTriLienQuan from './FormGiaTriLienQuan';

const FormCauHinh = (props: { onCancel: any; dataState?: string; dataSetState?: string }) => {
	const [form] = Form.useForm();
	const {
		setRecordCauHinh,
		formSubmiting,
		loading,
		editCauHinh,
		recordCauHinh,
		setEditCot,
		setRecordCot,
		record,
		setRecord,
	} = useModel('chedochinhsach.chedochinhsach');
	const { getAllModel: getAllDanhMucChung, loading: loadingDanhMucChung, danhSach } = useModel('quytrinh.danhmuc');

	const [kieuDuLieu, setKieuDuLieu] = useState<EKieuDuLieu>(recordCauHinh?.kieuDuLieu ?? EKieuDuLieu.BOOLEAN);
	const [truongThongTinLienQuan, setTruongThongTinLienQuan] = useState<LoaiHinh.TruongThongTin | undefined>(
		record?.danhSachCauHinhThongTin?.find((item: { ma: any }) => item.ma === recordCauHinh?.truongThongTinLienQuan),
	);
	const loaiMacDinh = Form.useWatch('loaiDefaultValue', form);

	const [visibleCot, setVisibleCot] = useState<boolean>(false);
	const [formValues, setFormValues] = useState<any>({});

	useEffect(() => {
		form.setFieldsValue(
			recordCauHinh?.ma && editCauHinh ? recordCauHinh : { ...form, batBuoc: true, laDangMang: false },
		);
	}, [recordCauHinh?.ma]);

	const onFinish = async (values: LoaiHinh.TruongThongTin, isContinue: boolean) => {
		if (!record) return;

		const listMaCauHinh = editCauHinh
			? record.danhSachCauHinhThongTin.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
			: record.danhSachCauHinhThongTin;

		if (listMaCauHinh?.map((item: { ma: any }) => item.ma)?.includes(values?.ma)) {
			message.error('Mã đã tồn tại');
			return;
		}

		if (editCauHinh && recordCauHinh) {
			const index = record.danhSachCauHinhThongTin.map((item: { ma: any }) => item.ma).indexOf(recordCauHinh.ma);
			const danhSachCauHinhThongTin = [...record.danhSachCauHinhThongTin];
			danhSachCauHinhThongTin.splice(index, 1, { ...recordCauHinh, ...values });
			setRecord({ ...record, danhSachCauHinhThongTin });
		} else {
			setRecord({
				...record,
				danhSachCauHinhThongTin: [...(record?.danhSachCauHinhThongTin ?? []), { ...recordCauHinh, ...values }],
			});
		}
		message.success(editCauHinh ? 'Sửa thành công' : 'Thêm thành công');
		if (isContinue) {
			form.resetFields();
		} else props.onCancel();
	};

	const onCancelFormCot = () => {
		setVisibleCot(false);
	};

	const columns: IColumn<LoaiHinh.Cot>[] = [
		{
			title: 'Mã cột',
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Tên cột',
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Kiểu dữ liệu',
			align: 'center',
			dataIndex: 'kieuDuLieu',
			width: 60,
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: LoaiHinh.Cot) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setVisibleCot(true);
								setRecordCot(rec);
								setEditCot(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								if (recordCauHinh) {
									setRecordCauHinh({
										...recordCauHinh,
										danhSachCot: recordCauHinh?.danhSachCot?.filter((item: { ma: string }) => item.ma !== rec.ma),
									});
									form.setFieldsValue({
										danhSachCotHienThi: formValues?.danhSachCotHienThi?.filter((item: string) => item !== rec.ma),
									});
								}
							}}
							title='Bạn có chắc chắn muốn xóa ?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const onSortEnd = (recordTemp: LoaiHinh.Cot, newIndex: number): void => {
		if (!recordCauHinh) return;
		const danhSachCot = recordCauHinh?.danhSachCot?.filter((item: { ma: string }) => item.ma !== recordTemp.ma) ?? [];
		danhSachCot?.splice(newIndex, 0, recordTemp);
		setRecordCauHinh({ ...recordCauHinh, danhSachCot });
	};

	const isAvailableDangMang = [
		EKieuDuLieu.DANHMUC,
		EKieuDuLieu.DECIMAL,
		EKieuDuLieu.NUMBER,
		EKieuDuLieu.TEXT,
		EKieuDuLieu.FILE,
	].includes(kieuDuLieu);

	return (
		<Card title={(editCauHinh ? 'Chỉnh sửa ' : 'Thêm mới ') + 'cấu hình'}>
			<Form
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				onFinish={(values) => onFinish(values, false)}
				form={form}
				layout='vertical'
			>
				<Form.Item name='ma' label='Mã' rules={[...rules.required, ...rules.text]}>
					<Input placeholder='Mã' />
				</Form.Item>
				<Form.Item name='ten' label='Tên' rules={[...rules.required, ...rules.text]}>
					<Input
						autoFocus
						onChange={(e) => {
							if (!editCauHinh) {
								form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
							}
						}}
						placeholder='Tên'
					/>
				</Form.Item>
				<Form.Item name='loaiDefaultValue' label='Loại giá trị mặc định'>
					<Select
						showSearch
						allowClear
						placeholder={'Chọn loại giá trị'}
						options={Object?.values(LoaiDefaultValue)?.map((val) => {
							return {
								value: val,
								label: val,
							};
						})}
					/>
				</Form.Item>
				{loaiMacDinh === LoaiDefaultValue.CUSTOM && (
					<Form.Item name='customDefaultValue' label='Giá trị mặc định tuỳ biến'>
						<Input placeholder='Nhập giá trị mặc định' />
					</Form.Item>
				)}
				{kieuDuLieu === EKieuDuLieu.DOAN_VAN_BAN && (
					<Form.Item rules={[...rules.requiredHtml]} name='customDefaultValue' label='Đoạn văn bản'>
						<TinyEditor height={350} />
					</Form.Item>
				)}
				{loaiMacDinh === LoaiDefaultValue.THONG_KE_DON_QUY_TRINH && (
					<Form.Item
						label='Cấu hình thống kê'
						name={'customAggregationArray'}
						rules={[...rules.required, ...rules.json]}
					>
						<JsonEditor />
					</Form.Item>
				)}

				<Form.Item name='readonly' valuePropName='checked'>
					<Checkbox>Chỉ đọc</Checkbox>
				</Form.Item>
				<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
					<Input.TextArea placeholder='Ghi chú' />
				</Form.Item>

				<Form.Item name='kieuDuLieu' label='Kiểu dữ liệu' rules={[...rules.required]}>
					<Select
						onChange={(val) => setKieuDuLieu(val)}
						options={Object.values(EKieuDuLieu).map((item) => ({ label: item, value: item }))}
						placeholder='Kiểu dữ liệu'
					/>
				</Form.Item>
				<Row gutter={[12, 0]}>
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item name='batBuoc' label='Bắt buộc' rules={[...rules.required]}>
							<Radio.Group
								options={[
									{ value: true, label: 'Có' },
									{ value: false, label: 'Không' },
								]}
							/>
						</Form.Item>
					</Col>

					{isAvailableDangMang && (
						<Col span={isAvailableDangMang ? 8 : 12}>
							<Form.Item name='laDangMang' label='Cho phép nhập nhiều giá trị' rules={[...rules.required]}>
								<Radio.Group
									options={[
										{ value: true, label: 'Có' },
										{ value: false, label: 'Không' },
									]}
								/>
							</Form.Item>
						</Col>
					)}
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item name='colspan' label='Chiều rộng'>
							<InputNumber style={{ width: '100%' }} min={0} max={24} placeholder='Nhập giá trị' />
						</Form.Item>
					</Col>
				</Row>
				{kieuDuLieu === EKieuDuLieu.FILE && (
					<>
						<Form.Item name='danhSachFileDinhKem' label='File đính kèm (nếu có)'>
							<UploadFile maxCount={5} />
						</Form.Item>
						<Form.Item name='ghiChuFileDinhKem' label='Ghi chú File đính kèm (nếu có)'>
							<Input placeholder='Nhập ghi chú nếu có' />
						</Form.Item>
					</>
				)}
				{kieuDuLieu === EKieuDuLieu.TEXT && (
					<Form.Item name='textDisplay' label='Kiểu hiển thị đặc biệt (nếu có)'>
						<Select
							placeholder='Chọn kiểu hiển thị'
							options={Object.values(ETextDisplay).map((item) => ({ value: item, label: MapKeyNameTextDisplay[item] }))}
						/>
					</Form.Item>
				)}
				{kieuDuLieu === EKieuDuLieu.DANHMUC && (
					<Form.Item
						name='maDanhMuc'
						label={
							<span>
								Danh mục (
								<Button
									loading={loadingDanhMucChung}
									onClick={() => {
										getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
									}}
									style={{ padding: 0 }}
									type='link'
								>
									Làm mới
								</Button>
								)
							</span>
						}
						rules={[...rules.required]}
					>
						<Select
							options={danhSach.map((item) => ({
								label: (
									<Popover
										placement='left'
										content={() => {
											return (
												<div>
													{item.danhSachGiaTri.map((giaTri: { value: string }) => (
														<div key={giaTri.value}>- {giaTri.value}</div>
													))}
												</div>
											);
										}}
									>
										{item.maDanhMuc}
									</Popover>
								),
								value: item.maDanhMuc,
							}))}
							placeholder='Danh mục'
						/>
					</Form.Item>
				)}
				{kieuDuLieu === EKieuDuLieu.TABLE && (
					<>
						<div className='ant-descriptions-title' style={{ marginTop: 12, marginBottom: 12 }}>
							Danh sách cột
						</div>
						<TableStaticData
							onSortEnd={onSortEnd}
							rowSortable
							size='small'
							columns={columns}
							data={recordCauHinh?.danhSachCot ?? []}
							addStt
							hasTotal
							loading={loading}
						>
							<Space wrap>
								<Button
									size='small'
									type='primary'
									icon={<PlusCircleOutlined />}
									onClick={() => {
										setEditCot(false);
										setVisibleCot(true);
										setRecordCot(undefined);
									}}
								>
									Thêm mới
								</Button>
							</Space>
						</TableStaticData>

						<Form.Item
							extra={'Để trống nếu muốn hiển thị tất cả các cột'}
							style={{ marginTop: 8 }}
							name='danhSachCotHienThi'
							label='Danh sách cột hiển thị'
							// rules={[...rules.required]}
						>
							<Select
								allowClear
								options={recordCauHinh?.danhSachCot?.map((item: { ten: any; ma: any }) => ({
									label: item.ten,
									value: item.ma,
								}))}
								mode='multiple'
								placeholder='Danh sách cột hiển thị'
							/>
						</Form.Item>
					</>
				)}

				<Form.Item name='truongThongTinLienQuan' label='Trường thông tin liên quan'>
					<Select
						allowClear
						onChange={(val) => {
							form.setFieldsValue({ giaTriLienQuan: undefined });
							setTruongThongTinLienQuan(record?.danhSachCauHinhThongTin?.find((item: { ma: any }) => item.ma === val));
						}}
						options={record?.danhSachCauHinhThongTin
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder='Trường thông tin liên quan'
					/>
				</Form.Item>
				{truongThongTinLienQuan?.kieuDuLieu ? (
					<FormGiaTriLienQuan truongThongTinLienQuan={truongThongTinLienQuan} />
				) : null}

				<Form.Item name='layDuLieuTu' label='Lấy dữ liệu từ trường thông tin'>
					<Select
						allowClear
						options={record?.danhSachCauHinhThongTin
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder='Lấy dữ liệu từ trường thông tin'
					/>
				</Form.Item>

				<Form.Item name='truongLayDuLieu' label='Trường lấy dữ liệu' rules={[...rules.text]}>
					<Input placeholder='Trường lấy dữ liệu' />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!editCauHinh ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					{!editCauHinh && (
						<Button
							loading={formSubmiting}
							onClick={() => {
								form.validateFields();
								const values = form.getFieldsValue();
								onFinish(values, true);
							}}
							type='primary'
						>
							Thêm mới và tiếp tục
						</Button>
					)}
					<Button onClick={() => props.onCancel()}>Hủy</Button>
				</div>
			</Form>
			<Modal
				width={700}
				open={visibleCot}
				destroyOnClose
				footer={null}
				styles={{ padding: 0 }}
				onCancel={onCancelFormCot}
			>
				<FormCot onCancel={onCancelFormCot} />
			</Modal>
		</Card>
	);
};

export default FormCauHinh;
