import { unitName } from '@/services/base/constant';
import { Card } from 'antd';
import { useIntl } from 'umi';
import './components/style.less';

const TrangChu = () => {
	const intl = useIntl();

	return (
		<Card styles={{ body: { height: '100%' } }} variant='borderless'>
			<div className='home-welcome'>
				<h1 className='title'>{intl.formatMessage({ id: 'pages.trangchu.title' })}</h1>
				<h2 className='sub-title'>
					{intl.formatMessage({ id: 'pages.trangchu.subtitle' })} - {intl.formatMessage({ id: unitName }).toUpperCase()}
				</h2>
			</div>
		</Card>
	);
};

export default TrangChu;
