import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import { type ThongBao } from '@/services/ThongBao/typing';
import { DeleteOutlined, EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Segmented, Space, Tabs } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ViewThongBao from './ViewThongBao/CardView';
import TableReceiverThongBao from './ViewThongBao/TableReceiver';
import Form from './components/Form';

const ThongBaoPage = () => {
	const { page, limit, setRecord, record, getModel, deleteModel, setSortTime } = useModel('thongbao.thongbao');
	const [visibleView, setVisibleView] = useState<boolean>(false);
	const [visibleNguoiNhan, setVisibleNguoiNhan] = useState<boolean>(false);
	const [type, setType] = useState<string>('MONTH');
	const [activeKey, setActiveKey] = useState('ban_hanh');
	const [startDate, setStartDate] = useState<any>(moment());
	const startDay = startDate?.format('DD/MM');
	const endDay = startDate.clone()?.add(6, 'day')?.format('DD/MM');

	const getData = () => {
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

		//@ts-ignore
		getModel(
			{
				notificationInternal: activeKey === 'tu_dong',
			},
			[{ active: true, field: 'createdAt', operator: EOperatorType.BETWEEN, values: value }],
		);
	};

	const handleView = (rec: ThongBao.IRecord) => {
		setRecord(rec);
		setVisibleView(true);
	};

	const onCell = (rec: ThongBao.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

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
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			width: 280,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Người nhận',
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<a
					href='#'
					onClick={() => {
						setRecord(rec);
						setVisibleNguoiNhan(true);
					}}
				>
					Xem chi tiết
				</a>
			),
		},
		{
			title: 'Thời gian gửi',
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			onCell,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Xem chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />

					{/* <ButtonExtend
						tooltip='Chỉnh sửa'
						disabled={activeKey === 'tu_dong'}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/> */}

					<Popconfirm
						disabled={activeKey === 'tu_dong'}
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa?'
					>
						<ButtonExtend
							tooltip='Xóa'
							disabled={activeKey === 'tu_dong'}
							type='link'
							danger
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				title='Thông báo'
				columns={columns}
				modelName='thongbao.thongbao'
				widthDrawer={1000}
				dependencies={[page, limit, type, startDate, activeKey]}
				Form={Form}
				getData={getData}
				formProps={{ getData }}
				destroyModal
				buttons={{ create: activeKey === 'ban_hanh' ? true : false }}
			>
				<Tabs onChange={(key: any) => setType(key)} activeKey={type} defaultActiveKey='MONTH'>
					<Tabs.TabPane tab='Theo tháng' key='MONTH' />
					<Tabs.TabPane tab='Theo tuần' key='WEEK' />
					<Tabs.TabPane tab='Theo ngày' key='DAY' />
				</Tabs>

				<Space wrap style={{ marginBottom: 12 }}>
					<Segmented
						value={activeKey}
						onChange={(value) => setActiveKey(value.toString())}
						options={[
							{ value: 'ban_hanh', label: 'Ban hành thông báo' },
							{ value: 'tu_dong', label: 'Thông báo tự động' },
						]}
					/>

					{type === 'WEEK' ? (
						<>
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
						</>
					) : type === 'DAY' ? (
						<MyDatePicker
							allowClear={false}
							style={{ width: 150 }}
							value={moment(startDate)}
							onChange={(val) => setStartDate(moment(val))}
						/>
					) : (
						<MyDatePicker
							allowClear={false}
							pickerStyle='month'
							format='MM/YYYY'
							style={{ width: 150 }}
							value={moment(startDate)}
							onChange={(val) => setStartDate(moment(val))}
						/>
					)}
				</Space>
			</TableBase>

			<Modal
				width={800}
				bodyStyle={{ padding: 0 }}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				visible={visibleView}
				onCancel={() => setVisibleView(false)}
				destroyOnClose
			>
				<ViewThongBao record={record} />
			</Modal>

			<Modal
				title='Danh sách người nhận'
				width={800}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				visible={visibleNguoiNhan}
				onCancel={() => setVisibleNguoiNhan(false)}
				destroyOnClose
			>
				<TableReceiverThongBao record={record} />
			</Modal>
		</>
	);
};

export default ThongBaoPage;
