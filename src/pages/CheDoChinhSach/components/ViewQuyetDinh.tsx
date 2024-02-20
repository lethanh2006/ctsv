import ViewRender from '@/pages/QuyTrinhDong/QuanLyQuyTrinh/components/MauDon/ViewRender';
import { EKieuDuLieu, ETextDisplay } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import { Col, Row } from 'antd';
import { useModel } from 'umi';

const ViewQuyetDinh = () => {
	const { record } = useModel('chedochinhsach.chedochinhsach');
	const { record: recordQuyetDinh } = useModel('chedochinhsach.quyetdinhchedosinhvien');
	return (
		<Row gutter={[0, 10]}>
			{record?.danhSachCauHinhThongTin.map((item) => {
				if (
					!item?.truongThongTinLienQuan ||
					(item?.truongThongTinLienQuan &&
						(recordQuyetDinh?.thongTinQuyetDinh?.[item?.truongThongTinLienQuan]?.value === item?.giaTriLienQuan ||
							(item.giaTriLienQuan.includes &&
								item?.giaTriLienQuan?.includes(
									recordQuyetDinh?.thongTinQuyetDinh?.[item?.truongThongTinLienQuan]?.value,
								))))
				) {
					const isTable = item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH;
					const isHtml = item.kieuDuLieu === EKieuDuLieu.TEXT && item.textDisplay === ETextDisplay.TEXT_EDITOR;
					const isDoanVanBan = item.kieuDuLieu === EKieuDuLieu.DOAN_VAN_BAN;

					return (
						<Col key={item.ma} xs={24} sm={24} md={item.colspan || 24} lg={item.colspan || 24}>
							<div
								style={{
									display: 'flex',
									flexDirection: isHtml || isTable ? 'column' : 'row',
								}}
							>
								<div style={{ marginRight: 4 }}>
									<b>{item.ten}: </b>
								</div>
								<div>
									{isDoanVanBan ? (
										item.ten
									) : (
										<ViewRender
											cauHinh={item}
											recordSanPham={{
												thongTinKhaiBao: recordQuyetDinh?.thongTinQuyetDinh,
											}}
										/>
									)}
								</div>
							</div>
						</Col>
					);
				} else return null;
			})}
		</Row>
	);
};

export default ViewQuyetDinh;
