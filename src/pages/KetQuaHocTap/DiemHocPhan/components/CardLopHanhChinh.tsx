import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectHinhThuc from '@/pages/DanhMucHeThong/CoSo/HinhThuc/components/Select';
import SelectNganhCoSo from '@/pages/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectTrinhDo from '@/pages/DanhMucHeThong/CoSo/TrinhDo/components/Select';
import SelectKhoaSinhVien from '@/pages/NamHoc/KhoaSinhVien/components/Select';
import SelectLopHanhChinhCondition from '@/pages/NamHoc/LopHanhChinh/components/SelectLopHanhChinhCondition';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const CardLopHanhChinh = () => {
  const [trinhDoDaoTaoId, setTrinhDoId] = useState<string>();
  const [hinhThucDaoTaoId, setHinhThucId] = useState<string>();
  const [khoaSinhVienId, setKhoaSinhVienId] = useState<string>();
  const { setCondition, condition } = useModel('namhoc.lophanhchinh');
  const {
    setCondition: setConditionSinhVien,
    getModel,
    page,
    limit,
    setRecord,
    record,
  } = useModel('namhoc.sinhvienlophanhchinh');
  const [expand, setExpand] = useState(false);

  const onCell = (rec: LopHanhChinh.IRecordSinhVien) => ({
    onClick: () => {
      setRecord(rec);
    },
    style: { cursor: 'pointer', fontWeight: rec._id === record?._id ? 500 : 400 },
  });

  const getData = () =>
    getModel().then((data) => {
      setRecord(data?.[0]);
    });

  const columns: IColumn<LopHanhChinh.IRecordSinhVien>[] = [
    {
      title: 'Mã sinh viên',
      width: 120,
      onCell,
      render: (val, rec) => rec.sinhVien?.ma,
    },
    {
      title: 'Họ tên',
      width: 150,
      onCell,
      render: (val, rec) => rec.sinhVien?.ten,
    },
  ];

  return (
    <Card title="Lớp hành chính">
      <Row gutter={[8, 8]}>
        {expand ? (
          <>
            <Col span={24} xxl={12}>
              <SelectTrinhDo
                onChange={(val) => {
                  setTrinhDoId(val);
                  setKhoaSinhVienId(undefined);
                }}
                allowClear
                placeholder="Lọc theo trình độ đào tạo"
              />
            </Col>
            <Col span={24} xxl={12}>
              <SelectHinhThuc
                onChange={(val) => {
                  setHinhThucId(val);
                  setKhoaSinhVienId(undefined);
                }}
                allowClear
                placeholder="Lọc theo hình thức đào tạo"
              />
            </Col>
          </>
        ) : null}
        <Col span={24} xxl={12}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              icon={expand ? <DownOutlined /> : <UpOutlined />}
              type="text"
              onClick={() => setExpand((e) => !e)}
            />
            <SelectKhoaSinhVien
              hasCreate={false}
              value={khoaSinhVienId}
              onChange={(val) => {
                setKhoaSinhVienId(val);
                setCondition({ ...condition, khoaSinhVienId });
              }}
              allowClear
              condition={{ hinhThucDaoTaoId, trinhDoDaoTaoId }}
            />
          </div>
        </Col>
        <Col span={24} xxl={12}>
          <SelectNganhCoSo
            onChange={(val) => setCondition({ ...condition, nganhId: val })}
            allowClear
          />
        </Col>
        <Col span={24}>
          <SelectLopHanhChinhCondition
            onChange={(val) => setConditionSinhVien({ lopHanhChinhId: val })}
          />
        </Col>

        <Col span={24}>
          <TableBase
            hideCard
            getData={getData}
            columns={columns}
            dependencies={[page, limit]}
            modelName="namhoc.sinhvienlophanhchinh"
            hideTotal
            buttons={{ reload: false, create: false }}
            otherProps={{ size: 'small' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default CardLopHanhChinh;
