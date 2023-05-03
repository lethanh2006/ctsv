import { LoaiDanhHieuThiDuaKhenThuongGiaiThuong } from '@/utils/constants';
import { Card, Table } from 'antd';

const LoaiDanhHieu = () => {
  return (
    <Card title="Loại danh hiệu thi đua khen thưởng">
      <Table
        columns={[
          {
            title: 'STT',
            dataIndex: 'index',
            align: 'center',
            width: 200,
          },
          {
            title: 'Loại danh hiệu',
            dataIndex: 'ten',
            align: 'center',
          },
        ]}
        dataSource={Object.values(LoaiDanhHieuThiDuaKhenThuongGiaiThuong).map((item, index) => ({
          index: index + 1,
          ten: item,
        }))}
      />
    </Card>
  );
};

export default LoaiDanhHieu;
