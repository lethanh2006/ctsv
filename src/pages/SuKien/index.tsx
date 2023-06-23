import { messagesCalendar } from '@/services/Calendar/constant';
import { ColorSuKien, type ELoaiSuKien } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Row, Spin } from 'antd';
import moment, { type Moment } from 'moment';
import { useEffect, useState } from 'react';
import type { DateRange, View } from 'react-big-calendar';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
import FormSuKien from './components/Form';
import ModalViewDetailCalendar from './components/ModalViewDetail';
const localizer = momentLocalizer(moment);

const SuKienPage = () => {
  const {
    visibleForm,
    setVisibleForm,
    setRecord,
    setEdit,
    selectSuKiens,
    getSuKienTrongKhoangModel,
    loading,
  } = useModel('sukien');
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<Moment[]>([
    moment().startOf('week'),
    moment().endOf('week'),
  ]);
  const [calendarView, setCalendarView] = useState<View>(Views.WEEK);
  const [dataCalendar, setDataCalendar] = useState<{ title: string; [x: string]: unknown }[]>([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleXemThem, setVisibleXemThem] = useState<boolean>(false);
  const [eventsRecord, setEventRecord] = useState<SuKien.IRecord[]>([]);
  const [dateXemThem, setDateXemThem] = useState<any>();
  const [selectEvent, setSelectEvent] = useState<any>();

  //#region Get Data
  const getSuKien = async (): Promise<any[]> =>
    getSuKienTrongKhoangModel({
      fromDate: dateRange[0].toISOString(),
      toDate: dateRange[1].toISOString(),
      types: selectSuKiens,
    }).then((data) => {
      const temp = data.map((item) => ({
        ...item,
        title: item?.tenSuKien ?? '',
        start: moment(item?.thoiGianBatDau).toDate(),
        end: moment(item?.thoiGianKetThuc).toDate(),
      }));
      return temp;
    });

  const getData = () => {
    getSuKien()
      .then((values) => {
        setDataCalendar(values);
      })
      .catch((er) => console.log(er));
  };

  //#endregion

  useEffect(() => {
    getData();
  }, [dateRange[0].valueOf(), dateRange[1].valueOf(), ...selectSuKiens]);

  const eventPropGetter = (event: { title: string; loaiSuKien?: string }) => ({
    style: { backgroundColor: ColorSuKien?.[event?.loaiSuKien as ELoaiSuKien] },
  });

  const eventCustom = ({ event }: any) => {
    const { title, loaiSuKien } = event;
    return (
      <div style={{ width: '100%', fontSize: 13 }}>
        <b>{loaiSuKien || ''}</b>: {title || '--'}
      </div>
    );
  };

  const handleSelect = (event?: any) => {
    setRecord({
      thoiGianBatDau: event?.start?.toISOString(),
      thoiGianKetThuc: event?.end?.toISOString(),
    } as SuKien.IRecord);
    setEdit(false);
    setVisibleForm(true);
  };

  return (
    <Card title="Sự kiện" bordered>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Button
            type="primary"
            onClick={() => {
              setRecord(undefined);
              setVisibleForm(true);
            }}
          >
            <PlusCircleOutlined /> Thêm sự kiện
          </Button>
        </Col>

        <Col span={24}>
          <Spin spinning={loading}>
            <Calendar
              formats={{
                dayHeaderFormat: 'dddd DD/MM/YYYY',
                dayRangeHeaderFormat: (range: DateRange) => {
                  return `${moment(range.start).format('DD/MM')} - ${moment(range.end).format(
                    'DD/MM',
                  )}`;
                },
              }}
              localizer={localizer}
              events={dataCalendar}
              defaultView={calendarView}
              onView={(view) => setCalendarView(view)}
              onRangeChange={(val) => {
                if (Array.isArray(val))
                  setDateRange([moment(val[0]).startOf('d'), moment(val.at(-1)).endOf('d')]);
                else setDateRange([moment(val.start).startOf('d'), moment(val.end).endOf('d')]);
              }}
              onNavigate={(newDate) => setDate(newDate)}
              selectable
              scrollToTime={new Date(1970, 1, 1, 6)}
              defaultDate={new Date()}
              date={date}
              messages={messagesCalendar}
              views={['month', 'week', 'day']}
              style={{ height: 700, overflow: 'auto' }}
              min={moment('0000', 'HHmm').toDate()}
              max={moment('2359', 'HHmm').toDate()}
              eventPropGetter={eventPropGetter}
              onSelectSlot={handleSelect}
              onSelectEvent={(rec: any) => {
                setSelectEvent(rec);
                setVisibleDetail(true);
              }}
              components={{ event: (event: any) => eventCustom(event) }}
              popup
              onShowMore={(events: any[], d) => {
                setEventRecord(events);
                setDateXemThem(d);
                setVisibleXemThem(true);
              }}
            />
          </Spin>
        </Col>
      </Row>

      <Modal
        visible={visibleForm}
        bodyStyle={{ padding: 0 }}
        onCancel={() => setVisibleForm(false)}
        footer={null}
        maskClosable={false}
      >
        <FormSuKien getData={getData} />
      </Modal>

      {/* Modal xem chi tiết lịch */}
      {selectEvent ? (
        <ModalViewDetailCalendar
          visible={visibleDetail}
          setVisible={setVisibleDetail}
          event={selectEvent}
          getData={getData}
        />
      ) : null}

      <Modal
        visible={visibleXemThem}
        title={'Lịch ' + moment(dateXemThem).format('dddd, ngà\\y DD/MM/YYYY')}
        onCancel={() => setVisibleXemThem(false)}
        footer={null}
      >
        {eventsRecord?.map((item: SuKien.IRecord) => {
          return (
            <div
              key={item._id}
              style={{
                backgroundColor: ColorSuKien?.[item?.loaiSuKien],
                color: 'white',
                padding: 5,
                marginBottom: 10,
                borderRadius: 2,
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectEvent(item);
                setVisibleDetail(true);
              }}
            >
              <b>{item?.loaiSuKien}</b>: {item?.tenSuKien}
            </div>
          );
        })}
      </Modal>
    </Card>
  );
};

export default SuKienPage;
