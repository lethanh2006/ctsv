import { Button, Card, Form } from 'antd';
import { useModel } from 'umi';
import SingleChoice from './QuestionType/SingleChoice';
import MultipleChoice from './QuestionType/MultipleChoice';
import NumericChoice from '../../KhaiBaoSucKhoe/components/Question/NumericChoice';
import GridChoice from './QuestionType/GridChoice';
import UploadFile from '@/components/Upload/UploadFile';

const FormBaiHoc = () => {
  const [form] = Form.useForm();
  const { loading, record, setVisibleForm } = useModel('tienich.bieumau');
  const renderQuestion = (question: BieuMau.CauHoi) => {
    let questionEleMent = <div />;
    // const recordDapAn = record?.danhSachTraLoi?.find((item) => item.idCauHoi === question._id);
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
        <div>
          <b>
            {question.batBuoc && <span style={{ color: '#dc3545' }}>*</span>}{' '}
            {question.noiDungCauHoi}
          </b>
        </div>
        <div>{questionEleMent}</div>
        <br />
      </div>
    );
  };
  return (
    <Card loading={loading} title="Chi tiết khảo sát">
      <Form labelCol={{ span: 24 }} form={form}>
        <h3>{record.tieuDe}</h3>

        <p>{record.moTa}</p>
        <div>
          {record.danhSachKhoi?.map((item: BieuMau.Khoi, index) => (
            <div key={index}>
              <div>{item.tieuDe}</div>
              <div>{item.moTa}</div>
              <div>
                {item.danhSachCauHoi?.map((cauHoi: BieuMau.CauHoi) => renderQuestion(cauHoi))}
              </div>
            </div>
          ))}
        </div>
        <br />
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button type="primary" onClick={() => setVisibleForm(false)}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormBaiHoc;
