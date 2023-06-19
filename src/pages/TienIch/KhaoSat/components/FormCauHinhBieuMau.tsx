import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Tooltip } from 'antd';
import { useModel } from 'umi';
import Block from './Block';
import styles from './block.css';

const FormCauHinhBieuMau = (props: { onBack: () => void }) => {
  const { loading, record, edit, postModel, putModel, setRecord, getModel } =
    useModel('tienich.bieumau');
  const [form] = Form.useForm();

  const getData = () => getModel(undefined, undefined, undefined, undefined, undefined, 'pageable');

  const onFinish = async (values: any) => {
    if (edit)
      putModel(record?._id ?? '', { ...record, ...values }, getData)
        .then()
        .catch((er) => console.log(er));
    else
      postModel(
        {
          ...record,
          ...values,
        },
        getData,
      )
        .then()
        .catch((er) => console.log(er));
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form}>
      <Form.List
        name="danhSachKhoi"
        initialValue={record?.danhSachKhoi ?? []}
        rules={[
          {
            validator: async (validate, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('Ít nhất 1 khối'));
              }
              return '';
            },
          },
        ]}
      >
        {(fields, { add, remove, move }, { errors }) => {
          return (
            <>
              {fields.map((field, index) => (
                <div key={field.key}>
                  <Card
                    size="small"
                    headStyle={{ padding: '0px 24px' }}
                    bodyStyle={{ padding: '8px 24px' }}
                    className={styles.block}
                    title={
                      <>
                        <div style={{ float: 'left' }}>Khối {index + 1}</div>
                        <Tooltip title="Xóa">
                          <CloseOutlined
                            style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
                            onClick={() => remove(field.name)}
                          />
                        </Tooltip>
                        <Tooltip title="Di chuyển lên">
                          <ArrowUpOutlined
                            style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
                            onClick={() => move(field.name, field.name - 1)}
                          />
                        </Tooltip>
                        <Tooltip title="Di chuyển xuống">
                          <ArrowDownOutlined
                            style={{ float: 'right', marginTop: 4 }}
                            onClick={() => move(field.name, field.name + 1)}
                          />
                        </Tooltip>
                      </>
                    }
                  >
                    <Block field={{ ...field }} />
                  </Card>
                  <br />
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '100%' }}
                  icon={<PlusOutlined />}
                >
                  Thêm khối
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          );
        }}
      </Form.List>

      <div className="form-footer">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            const valueView = form.getFieldsValue(true);
            setRecord({ ...record, ...valueView });
            props.onBack();
          }}
        >
          Quay lại
        </Button>
        <Button
          icon={edit ? <SaveOutlined /> : <PlusCircleOutlined />}
          loading={loading}
          htmlType="submit"
          type="primary"
        >
          {!edit ? 'Thêm mới' : 'Lưu Lại'}
        </Button>
      </div>
    </Form>
  );
};

export default FormCauHinhBieuMau;
