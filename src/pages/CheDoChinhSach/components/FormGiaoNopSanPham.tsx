import FormRender from '@/pages/QuyTrinhDong/QuanLyQuyTrinh/components/MauDon/FormRender';
import { EKieuDuLieu } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormGiaoNopSanPham = (props: { isView?: boolean; getData: any }) => {
	const [form] = Form.useForm();
	const { record } = useModel('chedochinhsach');
	const {
		edit,
		formSubmiting,
		loading,
		setVisibleForm,
		record: recordQuyetDinh,
		putModel,
		postModel,
		visibleForm,
		setLoading,
	} = useModel('quyetdinhchedosinhvien');
	const { danhSach: danhSachDanhMuc } = useModel('quytrinh.danhmuc');

	const [formValues, setFormValues] = useState<any>({
		...recordQuyetDinh,
		...recordQuyetDinh?.thongTinQuyetDinh,
	});

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (recordQuyetDinh?._id) {
			const buildRecSanPham: any = {};
			Object.keys(recordQuyetDinh.thongTinQuyetDinh).map((item) => {
				buildRecSanPham[item] = recordQuyetDinh.thongTinQuyetDinh[item]?.value;
			});

			const initValueForm = {
				...recordQuyetDinh,
				...buildRecSanPham,
			};
			form.setFieldsValue(initValueForm);
			setFormValues(initValueForm);
		}
	}, [recordQuyetDinh?._id, visibleForm]);

	const handleFinish = async () => {
		try {
			const formValuesFinal = form.getFieldsValue() || {};

			setLoading(true);
			for (const item in formValuesFinal) {
				const value = formValuesFinal[item];
				if (value?.fileList?.length) {
					formValuesFinal[item] = await buildUpLoadMultiFile(formValuesFinal, item);
				}
			}
			const thongTinQuyetDinh: any = {};

			const valuesForm = { ...(recordQuyetDinh?.thongTinQuyetDinh ?? {}), ...formValuesFinal };
			Object.keys(valuesForm).map((item) => {
				const cauHinh = record?.danhSachCauHinhThongTin?.find((ele) => ele.ma === item);
				const isDanhMuc = cauHinh?.kieuDuLieu === EKieuDuLieu.DANHMUC;
				const isDate = cauHinh?.kieuDuLieu === EKieuDuLieu.DATE;
				const isMonth = cauHinh?.kieuDuLieu === EKieuDuLieu.MONTH;
				thongTinQuyetDinh[item] = {
					value:
						(isDate || isMonth) && valuesForm
							? moment(valuesForm[item]).format(isDate ? 'DD/MM/YYYY' : 'MM/YYYY')
							: valuesForm[item],
					info: isDanhMuc
						? danhSachDanhMuc
								?.find((ele) => ele.maDanhMuc === cauHinh.maDanhMuc)
								?.danhSachGiaTri?.find((ele) => ele.value === valuesForm[item])?.info
						: undefined,
				};
			});
			const payload = {
				...recordQuyetDinh,
				thongTinQuyetDinh,
				cheDoSinhVienId: record?._id ?? '',
			};

			let res;
			if (edit && recordQuyetDinh) {
				await putModel(recordQuyetDinh?._id, payload, props.getData);
			} else {
				res = await postModel(payload, props.getData);
			}
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Card title={`${!edit ? 'Thêm mới' : 'Chỉnh sửa'} ${record?.ten}`}>
			<Form
				scrollToFirstError
				labelCol={{ span: 24 }}
				form={form}
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				onFinish={async (values) => {
					if (!record) return;
					handleFinish();
				}}
			>
				<Row gutter={[12, 0]}>
					{record?.danhSachCauHinhThongTin?.map((item) => (
						<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />
					))}
				</Row>

				{!props.isView && (
					<div className='form-footer'>
						<Button icon={<SaveOutlined />} loading={formSubmiting || loading} htmlType='submit' type='primary'>
							{'Lưu lại'}
						</Button>
						<Button icon={<CloseOutlined />} onClick={() => setVisibleForm(false)}>
							Hủy
						</Button>
					</div>
				)}
			</Form>
		</Card>
	);
};

export default FormGiaoNopSanPham;
