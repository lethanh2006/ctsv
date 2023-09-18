import { Col, Empty, Row, Space, Spin, Statistic, Typography } from 'antd';
import moment from 'moment';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { history, useModel, useParams } from 'umi';

const QRCodePage = () => {
	const { id } = useParams<{ id: string }>();
	const isSmScreen = useMediaQuery({
		query: '(min-width: 576px)',
	});

	const { getThongTinSuKien, isLoadingThongTinSuKien, thongTinSuKien } = useModel('sukien');

	useEffect(() => {
		if (!id) {
			history.push('/su-kien');
		} else {
			getThongTinSuKien(id);
		}
	}, [id]);

	const renderContent = () => {
		if (!isLoadingThongTinSuKien && !thongTinSuKien?.maSuKien) {
			return (
				<Empty
					description={
						<Space direction='vertical'>
							<Typography.Paragraph strong>Sự kiện không tồn tại</Typography.Paragraph>
						</Space>
					}
				/>
			);
		}
		return (
			<div style={{ minHeight: '100vh' }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<Row
						gutter={[16, 16]}
						style={{
							padding: '64px 0px',
							width: '100%',
						}}
					>
						<Col xs={24} sm={12} style={{ textAlign: isSmScreen ? 'right' : 'center', marginBottom: 12 }}>
							<QRCodeSVG value={thongTinSuKien?.maSuKien ?? ''} size={160} />
						</Col>
						<Col xs={24} sm={12} style={{ padding: '0px 12px' }}>
							<Typography.Text style={{ fontSize: 24 }} strong>
								{thongTinSuKien?.tenSuKien}
							</Typography.Text>
							{thongTinSuKien?.thoiGianBatDau && (
								<div>Bắt đầu: {moment(thongTinSuKien?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}</div>
							)}
							{thongTinSuKien?.thoiGianKetThuc && (
								<p>Kết thúc: {moment(thongTinSuKien?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}</p>
							)}
							<Statistic.Countdown title='Thời gian còn lại' value={thongTinSuKien?.thoiGianKetThuc} />
						</Col>
					</Row>
				</div>
			</div>
		);
	};

	return <Spin spinning={isLoadingThongTinSuKien}>{renderContent()}</Spin>;
};

export default QRCodePage;
