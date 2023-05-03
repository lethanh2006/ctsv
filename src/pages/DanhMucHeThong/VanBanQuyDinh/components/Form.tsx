import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Radio, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { uploadFile } from '@/services/uploadFile';
import UploadFile from '@/components/Upload/UploadFile';

const FormVanBanQuyDinh = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } =
    useModel('danhmuc.vanbanquydinh');
  const title = props?.title ?? '';
  const [typeUpload, setTypeUpload] = useState<'UPLOAD' | 'URL'>('URL');

  useEffect(() => {
    if (record?._id) {
      setTypeUpload('URL');
      form.setFieldsValue(record);
    } else form.resetFields();
  }, [record?._id]);

  const buildUpLoadFile = async (values: any, name: string) => {
    if (values?.[name]?.fileList?.[0]?.originFileObj) {
      const response = await uploadFile({
        file: values?.[name]?.fileList?.[0]?.originFileObj,
        public: '1',
      });
      return {
        ...response?.data?.data?.file,
        url: response?.data?.data?.url,
        _id: response?.data?.data?.file?.id,
      };
    } else return '';
  };

  const onFinish = async (values: VanBanQuyDinh.IRecord) => {
    if (typeUpload === 'UPLOAD') {
      const resFile = await buildUpLoadFile(values, 'url');
      values.url = resFile.url;
    }
    if (edit) {
      putModel(record?._id ?? '', values, getModel)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values, getModel)
        .then(() => {
          setTypeUpload('UPLOAD');
          form.resetFields();
        })
        .catch((er) => console.log(er));
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
          <Col xs={24}>
            <Form.Item
              name="ma"
              label="Mã căn cứ"
              rules={[...rules.required, ...rules.text, ...rules.length(20)]}
            >
              <Input placeholder="Nhập mã căn cứ" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="ten"
              label="Tên căn cứ"
              rules={[...rules.required, ...rules.text, ...rules.length(250)]}
            >
              <Input placeholder="Nhập tên căn cứ" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="noiDung"
              label="Nội dung"
              rules={[...rules.required, ...rules.text, ...rules.length(5000)]}
            >
              <Input.TextArea rows={3} placeholder="Nhập nội dung" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="url"
              label={
                <>
                  Tệp đính kèm &nbsp;
                  <Radio.Group onChange={(e) => setTypeUpload(e.target.value)} value={typeUpload}>
                    <Radio value={'URL'}>Đường dẫn</Radio>
                    <Radio value={'UPLOAD'}>Tải lên</Radio>
                  </Radio.Group>
                </>
              }
              rules={[
                ...rules.required,
                ...(typeUpload === 'UPLOAD' ? rules.fileRequired : rules.httpLink),
              ]}
            >
              {typeUpload === 'UPLOAD' ? (
                <UploadFile
                  maxCount={1}
                  otherProps={{
                    accept: '.docx, .pdf',
                    showUploadList: { showDownloadIcon: false },
                  }}
                />
              ) : (
                <Input placeholder="Nhập đường dẫn" />
              )}
            </Form.Item>
          </Col>
        </Row>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới ' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormVanBanQuyDinh;
