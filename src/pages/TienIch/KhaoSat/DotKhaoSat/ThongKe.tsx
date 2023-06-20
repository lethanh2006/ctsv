import { Button, Card } from 'antd';
import { useModel } from 'umi';
import GridChoice from './ThongKeType/GridChoice';
import NumericChoice from './ThongKeType/NumericChoice';
import SingleChoice from './ThongKeType/SingleChoice';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';

const ModalThongKe = () => {
  const { loading, thongKe, setVisibleForm } = useModel('tienich.dotkhaosat');

  const renderThongKe = (question: BieuMau.ThongKeCauHoi) => {
    let questionEleMent = <div />;
    if (
      (question.loai === 'SingleChoice' ||
        question.loai === 'MultipleChoice' ||
        question.loai === 'DropdownMenu') &&
      question.soLuongTraLoi
    )
      questionEleMent = <SingleChoice ketQua={question.ketQua as BieuMau.ThongKeLuaChon[]} />;
    else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
      questionEleMent = <GridChoice ketQua={question.ketQua as BieuMau.ThongKeLuaChonGrid[]} />;
    else if (question.loai === 'NumericRange')
      questionEleMent = (
        <NumericChoice ketQua={question.ketQua as BieuMau.ThongKeLuaChonNumeric[]} />
      );

    return (
      <div key={question?._id}>
        <div className="ant-form-item-label fw500">
          <label className={question.batBuoc ? 'ant-form-item-required' : ''}>
            {question.noiDungCauHoi}
          </label>
        </div>
        <br />
        <div className="fw500" style={{ marginBottom: 8 }}>
          Số lượt trả lời: {question.soLuongTraLoi}
        </div>
        {questionEleMent}
      </div>
    );
  };

  return (
    <Card loading={loading} title="Thống kê kết quả">
      <h3>{thongKe?.tieuDe}</h3>
      <p>{thongKe?.moTa}</p>

      {thongKe?.thongKeKhoi?.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <div className="fw500">{item.tieuDe}</div>
          <p>{item.moTa}</p>

          {item.thongKeCauHoi?.map((cauHoi) => renderThongKe(cauHoi))}
        </div>
      ))}

      <div className="form-footer">
        <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
      </div>
    </Card>
  );
};

export default ModalThongKe;
