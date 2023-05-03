import { DanhHieuThiDuaKhenThuongGiaiThuong } from '@/utils/constants';
import { Card, Table } from 'antd';

const DanhHieu = () => {
  return (
    <Card title="Danh hiệu thi đua khen thưởng">
      <Table
        columns={[
          {
            title: 'STT',
            dataIndex: 'index',
            align: 'center',
            width: 200,
          },
          {
            title: 'Tên danh hiệu thi đua khen thưởng',
            dataIndex: 'danhHieu',
            align: 'center',
          },

          {
            title: 'Loại danh hiệu thi đua khen thưởng',
            dataIndex: 'loaiDanhHieu',
            align: 'center',
            width: 250,
          },
        ]}
        dataSource={DanhHieuThiDuaKhenThuongGiaiThuong.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
      />
    </Card>
  );
};

export default DanhHieu;
