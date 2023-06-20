import UploadFile from '@/components/Upload/UploadFile';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { Button, Card } from 'antd';
import { useModel } from 'umi';
import GridChoice from './QuestionView/GridChoice';
import MultipleChoice from './QuestionView/MultipleChoice';
import NumericChoice from './QuestionView/NumericChoice';
import SingleChoice from './QuestionView/SingleChoice';
import Text from './QuestionView/Text';

const ViewDetailKhaoSat = () => {
  const { loading, record, setVisibleForm } = useModel('tienich.bieumau');

  const renderQuestion = (question: BieuMau.CauHoi) => {
    let questionEleMent = <div />;
    if (question.loai === 'SingleChoice')
      questionEleMent = <SingleChoice luaChon={question.luaChon} />;
    else if (question.loai === 'MultipleChoice')
      questionEleMent = <MultipleChoice luaChon={question.luaChon} />;
    else if (question.loai === 'Text') questionEleMent = <Text />;
    else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
      questionEleMent = <GridChoice hang={question.luaChonHang} cot={question.luaChonCot} />;
    else if (question.loai === 'NumericRange')
      questionEleMent = (
        <NumericChoice
          luaChon={{ start: question.gioiHanDuoiTuyenTinh, end: question.gioiHanTrenTuyenTinh }}
        />
      );
    else if (question.loai === 'UploadFile') {
      questionEleMent = (
        <UploadFile
          otherProps={{
            multiple: true,
            accept: 'image/*, .pdf, .doc, .docx',
            showUploadList: { showDownloadIcon: false },
          }}
          maxCount={5}
        />
      );
    }

    return (
      <div key={question._id}>
        <div className="ant-form-item-label fw500">
          <label className={question.batBuoc ? 'ant-form-item-required' : ''}>
            {question.noiDungCauHoi}
          </label>
        </div>
        <br />
        {questionEleMent}
        <br />
      </div>
    );
  };

  return (
    <Card loading={loading} title="Chi tiết biểu mẫu khảo sát">
      <h3>{record?.tieuDe}</h3>
      <p>{record?.moTa}</p>

      {record?.danhSachKhoi?.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <div className="fw500">{item.tieuDe}</div>
          <p>{item.moTa}</p>

          {item.danhSachCauHoi?.map((cauHoi) => renderQuestion(cauHoi))}
        </div>
      ))}

      <div className="form-footer">
        <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
      </div>
    </Card>
  );
};

export default ViewDetailKhaoSat;
