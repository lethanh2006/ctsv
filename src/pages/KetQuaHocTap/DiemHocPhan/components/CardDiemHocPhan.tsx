import { Card, Empty } from 'antd';
import { useModel } from 'umi';
import TableDiemHocPhan from './TableDiemHocPhan';

const CardDiemHocPhan = () => {
  const { record: recordSVLopHC } = useModel('namhoc.sinhvienlophanhchinh');

  return (
    <Card
      title={`Danh sách điểm theo học phần${
        recordSVLopHC?._id ? ' của sinh viên ' + recordSVLopHC.sinhVien?.ten : ''
      }`}
    >
      {recordSVLopHC?._id ? (
        <TableDiemHocPhan sinhVienSsoId={recordSVLopHC.sinhVienSsoId} />
      ) : (
        <Empty description="Vui lòng chọn sinh viên" />
      )}
    </Card>
  );
};

export default CardDiemHocPhan;
