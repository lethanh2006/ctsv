import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { thongKeNotification } from '@/services/ThongBao';
import {
	ColorLoaiDoiTuongThongBao,
	EReceiverType,
	FieldLoaiDoiTuongThongBao,
	LoaiDoiTuongThongBao,
} from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import { inputFormat } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Modal, Popconfirm, Row, Tabs, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import news from '../../assets/new6.gif';
import ViewThongBao from './ViewThongBao/CardView';
import Form from './components/Form';
import { EOperatorType } from '@/components/Table/constant';
const ThongBaoPage = () => {
	const { page, limit, setRecord, record, getModel, deleteModel, setSortTime, setEdit, setVisibleForm } =
		useModel('thongbao.thongbao');
	const { initialState } = useModel('@@initialState');
	const [visible, setVisible] = useState<boolean>(false);
	const [type, setType] = useState<string>('MONTH');
	const [startDate, setStartDate] = useState<any>(moment());
	const startDay = startDate?.format('DD/MM');
	const endDay = startDate.clone()?.add(6, 'day')?.format('DD/MM');
	const [dataThongKe, setDataThongKe] = useState<ThongBao.IThongKe>();
	const onCell = (recordThongBao: ThongBao.IRecord) => ({
		onClick: () => {
			setVisible(true);
			setRecord(recordThongBao);
		},
		style: { cursor: 'pointer' },
	});
	const getData = () => {
		if (!initialState?.currentUser?.ssoId) return;

		const value =
			type === 'DAY'
				? [moment(startDate)?.startOf('days').toISOString(), moment(startDate)?.endOf('days').toISOString()]
				: type === 'WEEK'
				? [
						moment(startDate)?.startOf('weeks')?.startOf('days').toISOString(),
						moment(startDate)?.startOf('weeks')?.add(6, 'days')?.endOf('days').toISOString(),
				  ]
				: [
						moment(startDate)?.startOf('months')?.startOf('days').toISOString(),
						moment(startDate)?.startOf('months')?.add(1, 'month')?.endOf('days').toISOString(),
				  ];
		setSortTime([{ field: 'createdAt', operator: 'between', values: value }]);

		getModel({ sender: initialState?.currentUser?.ssoId }, [
			{ field: 'createdAt', operator: EOperatorType.BETWEEN, values: value, active: true },
		]);
	};
	const columns: IColumn<ThongBao.IRecord>[] = [
		{
			title: 'Người gửi',
			dataIndex: 'senderName',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			width: 200,
			filterType: 'string',
			onCell,
			render: (val, recordVal) => (
				<>
					<ExpandText>
						{val}{' '}
						{moment().diff(moment(recordVal?.createdAt), 'days') < 3 ? (
							<img style={{ width: 30, height: 20 }} src={news} />
						) : (
							''
						)}
					</ExpandText>
				</>
			),
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			width: 280,
			filterType: 'string',
			onCell,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Đối tượng nhận thông báo',
			dataIndex: 'receiverType',
			width: 140,
			filterType: 'select',
			filterData: Object.values(EReceiverType).map((value) => ({
				value,
				label: LoaiDoiTuongThongBao?.[value] ?? '',
			})),
			onCell,
			render: (val: EReceiverType) => LoaiDoiTuongThongBao?.[val],
		},
		{
			title: 'Thời gian gửi',
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			onCell,
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (recordThongBao: ThongBao.IRecord) => (
				<>
					<Tooltip title='Xem chi tiết'>
						<Button
							onClick={() => {
								setRecord(recordThongBao);
								setVisible(true);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Sửa'>
						<Button
							onClick={() => {
								setRecord(recordThongBao);
								setEdit(true);
								setVisibleForm(true);
							}}
							shape='circle'
							type={'link'}
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								deleteModel(recordThongBao._id, getData);
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button shape='circle' type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];
	const getDataThongKe = async () => {
		try {
			const res = await thongKeNotification();
			if (res) {
				setDataThongKe(res?.data?.data);
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getDataThongKe();
	}, []);

	const FormThongBao = useCallback(
		() => <Form getData={getData} title='thông báo' />,
		[startDate, type, initialState?.currentUser?.ssoId],
	);

	return (
		<>
			<TableBase
				title='Thông báo'
				columns={columns}
				modelName='thongbao.thongbao'
				widthDrawer={1000}
				dependencies={[page, limit, type, startDate, initialState?.currentUser?.ssoId]}
				Form={FormThongBao}
				getData={getData}
				destroyModal
				otherButtons={[<></>]}
			>
				<div style={{ marginBottom: 16 }}>
					<Row gutter={[8, 8]}>
						{Object.entries(FieldLoaiDoiTuongThongBao)?.map(([val, field]) => (
							<Col span={12} md={8} key={val}>
								<Card className='card-stat-small'>
									<span className='num' style={{ color: ColorLoaiDoiTuongThongBao?.[val as EReceiverType] }}>
										{inputFormat(dataThongKe?.[field] ?? 0)}
									</span>
									<span>Thông báo {LoaiDoiTuongThongBao?.[val as EReceiverType]}</span>
								</Card>
							</Col>
						))}
					</Row>
				</div>

				<div>
					<Tabs
						onChange={(key: any) => {
							if (key === 'WEEK') {
								setStartDate(moment().startOf('week'));
							}
							if (key === 'DAY') {
								setStartDate(moment());
							}
							if (key === 'MONTH') {
								setStartDate(moment());
							}
							setType(key);
						}}
						activeKey={type}
						defaultActiveKey='MONTH'
					>
						<Tabs.TabPane tab='Theo tháng' key='MONTH' />
						<Tabs.TabPane tab='Theo tuần' key='WEEK' />
						<Tabs.TabPane tab='Theo ngày' key='DAY' />
					</Tabs>
					{type === 'WEEK' && (
						<div>
							<div
								style={{
									marginBottom: 16,
									display: 'flex',
									alignItems: 'center',
									gap: 24,
									textAlign: 'center',
								}}
							>
								<Button onClick={() => setStartDate(startDate.clone().subtract(7, 'day'))}>
									<LeftOutlined /> Tuần trước
								</Button>
								<span>
									Tuần: {startDay} - {endDay}
								</span>
								<Button onClick={() => setStartDate(startDate.clone().add(7, 'day'))}>
									Tuần sau <RightOutlined />
								</Button>
								<a onClick={() => setStartDate(moment().startOf('week'))}>Tuần này</a>
							</div>
						</div>
					)}
					{type === 'DAY' && (
						<div style={{ marginBottom: 16 }}>
							<DatePicker
								allowClear={false}
								format={'DD/MM/YYYY'}
								style={{ width: 300 }}
								value={moment(startDate)}
								onChange={(val) => {
									setStartDate(val);
								}}
							/>
						</div>
					)}
					{type === 'MONTH' && (
						<div style={{ marginBottom: 16 }}>
							<DatePicker
								allowClear={false}
								picker={'month'}
								format={'MM/YYYY'}
								style={{ width: 300 }}
								value={moment(startDate)}
								onChange={(val) => {
									setStartDate(val);
								}}
							/>
						</div>
					)}
				</div>
			</TableBase>

			<Modal
				width={800}
				bodyStyle={{ padding: 0 }}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				visible={visible}
				onCancel={() => setVisible(false)}
				destroyOnClose
			>
				<ViewThongBao record={record} />
			</Modal>
		</>
	);
};

export default ThongBaoPage;
