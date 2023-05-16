import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectHinhThuc from '@/pages/DanhMucHeThong/CoSo/HinhThuc/components/Select';
import SelectHocPhan from '@/pages/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import SelectTrinhDo from '@/pages/DanhMucHeThong/CoSo/TrinhDo/components/Select';
import SelectHocKy from '@/pages/HocKy/HocKy/components/SelectHocKy';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const CardLopHocPhan = () => {
  const [trinhDoDaoTaoId, setTrinhDoId] = useState<string>();
  const [hinhThucDaoTaoId, setHinhThucId] = useState<string>();
  const [hocKyId, setHocKyId] = useState<string>();
  const { setCondition, condition, page, limit, setRecord, getModel, record } =
    useModel('hocky.lophocphan');
  const [expand, setExpand] = useState(false);

  const onCell = (rec: LopHocPhan.IRecord) => ({
    onClick: () => {
      setRecord(rec);
    },
    style: { cursor: 'pointer', fontWeight: rec._id === record?._id ? 500 : 400 },
  });

  const getData = () =>
    getModel().then((data) => {
      setRecord(data?.[0]);
    });

  const columns: IColumn<LopHocPhan.IRecord>[] = [
    {
      title: 'Tên lớp học phần',
      dataIndex: 'ten',
      width: 150,
      onCell,
    },
  ];

  return (
    <Card title="Lớp học phần">
      <Row gutter={[8, 8]}>
        {expand ? (
          <>
            <Col span={24} xxl={12}>
              <SelectTrinhDo
                onChange={(val) => {
                  setTrinhDoId(val);
                  setHocKyId(undefined);
                }}
                allowClear
                placeholder="Lọc theo trình độ đào tạo"
              />
            </Col>
            <Col span={24} xxl={12}>
              <SelectHinhThuc
                onChange={(val) => {
                  setHinhThucId(val);
                  setHocKyId(undefined);
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
            <SelectHocKy
              hasCreate={false}
              value={hocKyId}
              onChange={(val) => {
                setHocKyId(val);
                setCondition({ ...condition, hocKyId });
              }}
              allowClear
              condition={{ hinhThucDaoTaoId, trinhDoDaoTaoId }}
            />
          </div>
        </Col>
        <Col span={24} xxl={12}>
          <SelectHocPhan
            onChange={(val) => setCondition({ ...condition, hocPhanId: val })}
            allowClear
          />
        </Col>

        <Col span={24}>
          <TableBase
            hideCard
            getData={getData}
            columns={columns}
            dependencies={[page, limit]}
            modelName="hocky.lophocphan"
            hideTotal
            buttons={{ reload: false, create: false }}
            otherProps={{ size: 'small' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default CardLopHocPhan;
