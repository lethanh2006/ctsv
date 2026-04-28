import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';


const CauHinhKhoanThuKTXPage = () => {
    const { getModel, page, limit, deleteModel, handleEdit } = useModel('kytucxa.khoanthu');

    const columns: IColumn<KyTucXa.IKhoanThuKTX>[] = [
        {
            title: 'Tên khoản thu',
            dataIndex: 'ten',
            width: 180,
            filterType: 'string',
        },
        {
            title: 'Đơn vị tính',
            width: 200,
            align: 'center',
            dataIndex: 'unitLabel',
            filterType: 'string',
        },
        {
            title: 'Mục thu',
            dataIndex: 'tenMucThu',
            width: 160,
            filterType: 'string',
        },
        {
            title: 'Số tiền',
            dataIndex: 'unitAmount',
            width: 120,
            align: 'center',
            sortable: true,
        },
        {
            title: 'Đơn vị tiền',
            dataIndex: 'currency',
            width: 130,
            align: 'center',
        },
        {
            title: 'Thao tác',
            align: 'center',
            width: 90,
            fixed: 'right',
            render: (val, record) => (
                <>
                    <Tooltip title='Chỉnh sửa'>
                        <Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title='Xóa'>
                        <Popconfirm
                            onConfirm={() => deleteModel(record._id, getModel)}
                            title='Bạn có chắc chắn muốn xóa khoản thu này?'
                            placement='topRight'
                        >
                            <Button danger type='link' icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </>
            ),
        },
    ];

    return (
        <TableBase
            columns={columns}
            dependencies={[page, limit]}
            modelName='kytucxa.khoanthu'
            title='Cấu hình Khoản thu'
            Form={Form}
            rowSelection
            deleteMany
        />
    );
};

export default CauHinhKhoanThuKTXPage;
