
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import Form from './FormHocKy';


const DanhSachMienKyTucXa = () => {
    const { handleEdit, deleteModel, getModel } = useModel('kytucxa.danhsachmienkytucxa');

    const columns: IColumn<KyTucXa.IDanhSachMienKTX>[] = [
        {
            title: 'Mã học kỳ',
            dataIndex: 'maHocKy',
            width: 220,
            filterType: 'string',
            sortable: true,
        },
        {
            title: 'Tên học kỳ',
            dataIndex: 'tenHocKy',
            width: 120,
            filterType: 'string',
        },
        {
            title: 'Hạn nộp minh chứng',
            dataIndex: 'hanhNopMinhChung',
            width: 140,
            filterType: 'string',
            render: (value) => value || '--',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghiChu',
            width: 150,
            align: 'center',
            filterType: 'datetime',
            sortable: true,
            render: (value) => (value ? dayjs(value).format('HH:mm DD/MM/YYYY') : '--'),
        },
        {
            title: 'Thao tác',
            width: 150,
            align: 'center',
            fixed: 'right',
            render: (_value, record) => (
                <>
                    <Tooltip title='Chỉnh sửa'>
                        <Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title='Xóa'>
                        <Popconfirm
                            onConfirm={() => deleteModel(record._id, getModel)}
                            title='Bạn có chắc chắn muốn xóa học kỳ này?'
                            placement='topLeft'
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
            modelName='kytucxa.danhsachmienkytucxa'
            title='Danh sách miễn ký túc xá'
            Form={Form}
            widthDrawer={900}
        />
    );
};

export default DanhSachMienKyTucXa;
