import { EditOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Button } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ViewKetQuaHocKy = (props: {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  ketQuaHocKyId?: string;
  hasEdit?: boolean;
}) => {
  const { visible, setVisible, ketQuaHocKyId, hasEdit } = props;
  const { record, getByIdModel, setVisibleForm, setEdit } = useModel('ketquahoctap.ketquahocky');

  useEffect(() => {
    if (visible && ketQuaHocKyId) getByIdModel(ketQuaHocKyId);
  }, [visible, ketQuaHocKyId]);

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      title="Chi tiết kết quả học tập học kỳ"
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
      width={600}
    >
      <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
        <Descriptions.Item label="Học kỳ" span={2}>
          {record?.hocKy?.ten}
        </Descriptions.Item>
        <Descriptions.Item label="Sinh viên" span={2}>
          {record?.sinhVien?.ten} - {record?.sinhVien?.ma}
        </Descriptions.Item>

        <Descriptions.Item label="GPA">{record?.gpa ?? '--'}</Descriptions.Item>
        <Descriptions.Item label="CPA">{record?.cpa ?? '--'}</Descriptions.Item>
        <Descriptions.Item label="Số tín chỉ đạt">{record?.soTinChiDat ?? '--'}</Descriptions.Item>
        <Descriptions.Item label="Tổng số tín chỉ tích lũy">
          {record?.tongSoTinChiTichLuy ?? '--'}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số tín chỉ nợ">
          {record?.tongSoTinChiNo ?? '--'}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số tín chỉ đã đăng ký">
          {record?.tongSoTinChiDaDk ?? '--'}
        </Descriptions.Item>
        <Descriptions.Item label="Trình độ">{record?.trinhDo ?? '--'}</Descriptions.Item>
      </Descriptions>

      {hasEdit ? (
        <div style={{ textAlign: 'center' }}>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => {
              setEdit(true);
              setVisibleForm(true);
              setVisible(false);
            }}
          >
            Chỉnh sửa
          </Button>
        </div>
      ) : null}
    </Modal>
  );
};

export default ViewKetQuaHocKy;
