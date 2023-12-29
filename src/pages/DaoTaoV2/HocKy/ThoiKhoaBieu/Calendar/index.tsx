import { ColorSuKien, ELoaiSuKien, messagesCalendar } from '@/services/DaoTaoV2/Calendar/constant';
import { Modal, Space, Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import type { DateRange, View } from 'react-big-calendar';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
import Form from '../components/Form';
import { PlusCircleOutlined } from '@ant-design/icons';
const localizer = momentLocalizer(moment);

const CalendarThoiKhoaBieu = (props: { fromPhanCong?: boolean }) => {
	const { getAllModel, visibleForm, setVisibleForm, setRecord, setEdit, setIsView } =
		useModel('daotaov2.hocky.thoikhoabieu');
	const { record: recLopHP } = useModel('daotaov2.hocky.lophocphan');
	const [calendarView, setCalendarView] = useState<View>(Views.MONTH);
	const [dataCalendar, setDataCalendar] = useState<{ title: string; [x: string]: unknown }[]>([]);
	const [date, setDate] = useState<Date>();
	const { fromPhanCong } = props;

	const getData = () => {
		getAllModel(false, undefined, { tenLopHocPhan: recLopHP?.ten }).then((da) => {
			const data = da.map((j) => ({
				...j,
				title: j.tenLopHocPhan,
				start: moment(j?.thoiGianBatDau).toDate(),
				end: moment(j?.thoiGianKetThuc).toDate(),
			}));
			const start = _.minBy(data, (item) => item.start)?.start;
			setDate(start);

			setDataCalendar(data);
		});
	};

	useEffect(() => {
		if (recLopHP?._id) getData();
	}, [recLopHP?._id]);

	const eventPropGetter = () => ({
		style: { backgroundColor: ColorSuKien?.[ELoaiSuKien.LICH_HOC] },
	});

	const eventCustom = ({ event }: any) => {
		const { title } = event;
		return <div style={{ width: '100%', fontSize: 13 }}>{title}</div>;
	};

	return (
		<>
			{!fromPhanCong ? (
				<Space style={{ marginBottom: 12 }}>
					<Button
						onClick={() => {
							setRecord(undefined);
							setIsView(false);
							setEdit(false);
							setVisibleForm(true);
						}}
						icon={<PlusCircleOutlined />}
						type='primary'
					>
						Thêm mới
					</Button>
				</Space>
			) : null}

			<Calendar
				formats={{
					dayRangeHeaderFormat: (range: DateRange) => {
						return `${moment(range.start).format('DD/MM')} - ${moment(range.end).format('DD/MM')}`;
					},
				}}
				localizer={localizer}
				events={dataCalendar}
				views={[Views.MONTH, Views.WEEK]}
				defaultView={Views.MONTH}
				view={calendarView}
				onView={(view) => setCalendarView(view)}
				defaultDate={new Date()}
				date={date}
				onNavigate={(newDate) => setDate(newDate)}
				selectable={false}
				messages={messagesCalendar}
				style={{ height: 400, overflow: 'auto' }}
				min={moment('0600', 'HHmm').toDate()}
				max={moment('2100', 'HHmm').toDate()}
				eventPropGetter={eventPropGetter}
				components={{ event: (event: any) => eventCustom(event) }}
				onShowMore={(events: any[], d) => {
					setCalendarView(Views.WEEK);
					setDate(d);
				}}
				// onSelectSlot={handleSelect}
				onSelectEvent={(rec: any) => {
					setRecord(rec);
					setEdit(true);
					setIsView(false);
					setVisibleForm(true);
				}}
			/>

			<Modal
				maskClosable={false}
				width={800}
				onCancel={() => setVisibleForm(false)}
				footer={false}
				bodyStyle={{ padding: 0 }}
				visible={visibleForm}
				destroyOnClose={false}
			>
				<Form getData={getData} title='lịch học' fromPhanCong={fromPhanCong} />
			</Modal>
		</>
	);
};

export default CalendarThoiKhoaBieu;
