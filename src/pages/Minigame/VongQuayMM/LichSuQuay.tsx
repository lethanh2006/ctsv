import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ETrangThaiQuay } from '@/services/LichSuQuay/constant';
import { MLichSuQuay } from '@/services/LichSuQuay/typing';
import { ETrangThaiVoucher } from '@/services/Voucher/constant';
import { currencyFormat, formatDateTimeVN } from '@/utils/utils';
import { Tag } from 'antd';
import { useModel } from 'umi';

const VoucherPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('lichsuquay.lichsuquay');

	const columns: IColumn<MLichSuQuay.IRecord>[] = [
		{
			title: 'Thời gian quay',
			dataIndex: 'ngayQuay',
			align: 'center',
			sortable: true,
			width: 120,
			render: (text) => formatDateTimeVN(text),
		},
		{
			title: 'Người quay',
			dataIndex: 'ssoId',
			width: 120,
            render: (text, record) => `${record.voucherNguoiDung?.[0]?.hoTen}`,
            filterType: 'string',
		},
		{
			title: 'Giải thưởng nhận được',
			dataIndex: 'trangThaiQuay',
			align: 'center',
			width: 80,
			filterType: 'select',
            filterData: [
                { label: 'Trúng thưởng', value: ETrangThaiQuay.TRUNG_THUONG },
                { label: 'Không trúng thưởng', value: ETrangThaiQuay.CHUC_MAY_MAN_LAN_SAU },
            ],
            render: (text, record: MLichSuQuay.IRecord) => <><Tag color={text === ETrangThaiQuay.TRUNG_THUONG ? 'green' : ''}>
				{text === ETrangThaiQuay.TRUNG_THUONG ? (record.voucherNguoiDung?.[0]?.cauHinhVoucher?.ten || 'Trúng thưởng') : 'Không trúng thưởng'}
			</Tag></>,
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='lichsuquay.lichsuquay'
			title='Lich sử quay'
			buttons={{ import: false, export: true, create: false }}
		/>
	);
};

export default VoucherPage;
