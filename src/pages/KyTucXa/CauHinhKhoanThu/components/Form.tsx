import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';
import SelectNamHoc from './SelectNamHoc';
import SelectUnitLabel from './SelectUnitLabel';
import { currencyOptions, ELoaiKhoanThu, ELoaiDoiTuong, loaiDoiTuongOptions } from '@/services/KyTucXa/constant';
import SelectMucThu from './SelectMucThu';

const FormKhoanThuKTX = () => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
        useModel('kytucxa.khoanthu');
    const { danhSach: danhSachMucThu } = useModel('kytucxa.mucthu');
    const { danhSach: danhSachToaNha, getAllModel: getAllToaNha } = useModel('kytucxa.toa');
    const { danhSach: danhSachPhong, getModel: getAllPhong } = useModel('kytucxa.phong');

    const loaiDoiTuong = Form.useWatch('loaiDoiTuong', form);

    useEffect(() => {
        if (visibleForm) {
            if (record?._id) form.setFieldsValue(record);
            else {
                resetFieldsForm(form);
                form.setFieldsValue({ loai: ELoaiKhoanThu.KTX });
            }
            getAllToaNha();
            getAllPhong();
        }
    }, [record?._id, visibleForm]);

    const handleValuesChange = (changedValues: any) => {
        if ('maMucThu' in changedValues) {
            const selectedMucThu = danhSachMucThu.find((item) => item.ma === changedValues.maMucThu);
            if (selectedMucThu) {
                form.setFieldsValue({ 
                    unitAmount: selectedMucThu.unitAmount,
                    tenMucThu: selectedMucThu.name,
                });
            }
        }
        if ('loaiDoiTuong' in changedValues) {
            form.setFieldsValue({ maDoiTuong: undefined });
        }
    };

    const onFinish = async (values: any) => {
        try {
            if (edit) {
                await putModel(record?._id ?? '', values);
            } else {
                await postModel(values);
            }
        } catch (er) {
            console.log(er);
        }
    };

    const formatCurrency = (value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const parseCurrency = (value: any) => value.replace(/\$\s?|(,*)/g, '');

    const maDoiTuongOptions = useMemo(() => {
        if (loaiDoiTuong === ELoaiDoiTuong.TOA_NHA) {
            return danhSachToaNha.map((item) => ({
                value: item.ma,
                label: item.ten,
            }));
        }
        if (loaiDoiTuong === ELoaiDoiTuong.PHONG) {
            return danhSachPhong.map((item) => ({
                value: item.ma,
                label: item?.ten ?? item.ma,
            }));
        }
        return [];
    }, [loaiDoiTuong, danhSachToaNha, danhSachPhong]);

    return (
        <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} cấu hình`}>
            <Form onFinish={onFinish} form={form} layout='vertical' onValuesChange={handleValuesChange}>
                <Row gutter={[12, 0]}>
                    <Col xs={24} md={12}>
                        <Form.Item name='maNamHoc' label='Năm học' rules={[...rules.required]}>
                            <SelectNamHoc />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name='ten' label='Tên khoản thu' rules={[...rules.required]}>
                            <Input placeholder='Nhập tên khoản thu' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name='loai' label='Loại' rules={[...rules.required]}>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name='loaiDoiTuong' label='Loại đối tượng' rules={[...rules.required]}>
                            <Select 
                                placeholder='Chọn loại đối tượng' 
                                options={loaiDoiTuongOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name='maDoiTuong' label='Đối tượng' rules={[...rules.required]}>
                            <Select 
                                placeholder='Chọn đối tượng' 
                                disabled={!loaiDoiTuong} 
                                showSearch 
                                optionFilterProp='label'
                                options={maDoiTuongOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name='unitLabel' label='Đơn vị tính' rules={[...rules.required]}>
                            <SelectUnitLabel />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name='maMucThu' label='Mục thu' rules={[...rules.required]}>
                            <SelectMucThu />
                        </Form.Item>
                    </Col>
                    <Form.Item name='tenMucThu' hidden>
                        <Input />
                    </Form.Item>
                    <Col xs={24} md={12}>
                        <Form.Item name='unitAmount' label='Số tiền' rules={[...rules.required]}>
                            <InputNumber 
                                placeholder='Nhập số tiền' 
                                style={{ width: '100%' }} 
                                formatter={formatCurrency} 
                                parser={parseCurrency} 
                                disabled
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name='currency' label='Loại tiền tệ' rules={[...rules.required]}>
                            <Select 
                                placeholder='Chọn loại tiền tệ' 
                                options={currencyOptions} 
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <div className='form-footer'>
                    <Button loading={formSubmiting} htmlType='submit' type='primary'>
                        {!edit
                            ? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
                            : `${intl.formatMessage({ id: 'global.button.luulai' })}`}
                    </Button>
                    <Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
                </div>
            </Form>
        </Card>
    );
};

export default FormKhoanThuKTX;
