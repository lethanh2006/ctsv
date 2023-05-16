import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTietHoc = (props: {
  value?: string;
  onChange?: any;
  hasCreate?: boolean;
  multiple?: boolean;
  loadData?: boolean;
  nhomTietHocId?: string;
}) => {
  const { value, onChange, hasCreate, multiple, loadData, nhomTietHocId } = props;
  const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } =
    useModel('danhmuc.tiethoc');

  useEffect(() => {
    if (loadData !== false && !visibleForm) getAllModel(false, undefined, { nhomTietHocId });
  }, [visibleForm, loadData, nhomTietHocId]);

  const onAddNew = () => {
    setRecord(undefined);
    setEdit(false);
    setVisibleForm(true);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <div className={hasCreate !== false ? 'width-select-custom' : 'fullWidth'}>
        <Select
          mode={multiple ? 'multiple' : undefined}
          value={value}
          onChange={onChange}
          options={danhSach.map((item) => ({
            key: item._id,
            value: item._id,
            label: `Tiết ${item.tietHoc} (${item?.nhomTietHoc?.ten})`,
          }))}
          showSearch
          optionFilterProp="label"
          placeholder="Chọn tiết học"
        />
      </div>

      {hasCreate !== false ? (
        <>
          <Button icon={<PlusOutlined />} onClick={onAddNew} />
          <Modal
            visible={visibleForm}
            bodyStyle={{ padding: 0 }}
            footer={null}
            onCancel={() => setVisibleForm(false)}
          >
            <Form title="Tiết học" />
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default SelectTietHoc;
