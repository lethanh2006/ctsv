import { Carousel, Empty, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableDiemHocPhan from './TableDiemThanhPhan';
import ChartDiemTrungBinh from './components/ChartDiemTrungBinh';
import ChartSoTinChi from './components/ChartSoTinChi';
import './components/style.less';

const KetQuaToanKhoaSinhVien = (props: { sinhVienSsoId?: string; hideDetail?: boolean }) => {
	const { getAllModel: getKetQuaHocKy, danhSach, loading } = useModel('daotao.ketquahocky');
	const { sinhVienSsoId, hideDetail } = props;

	const getData = () => sinhVienSsoId && getKetQuaHocKy(false, { maHocKy: 1 }, { sinhVienSsoId: sinhVienSsoId });

	useEffect(() => {
		getData();
	}, [sinhVienSsoId]);

	return (
		<Spin spinning={loading}>
			{danhSach.length ? (
				<>
					<Carousel autoplay pauseOnDotsHover>
						<div>
							<div style={{ marginBottom: 8 }}>
								<ChartSoTinChi />
							</div>
						</div>
						<div>
							<div style={{ marginBottom: 8 }}>
								<ChartDiemTrungBinh />
							</div>
						</div>
					</Carousel>

					{sinhVienSsoId && !hideDetail ? <TableDiemHocPhan sinhVienSsoId={sinhVienSsoId} /> : null}
				</>
			) : (
				<Empty description='Không có dữ liệu !' style={{ marginTop: 50, marginBottom: 32 }} />
			)}
		</Spin>
	);
};

export default KetQuaToanKhoaSinhVien;
