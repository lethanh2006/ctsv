import { Card, Typography, Tooltip, Button, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React from 'react';
import dayjs from 'dayjs';
import type { KyTucXa } from '@/services/KyTucXa/typing';

const { Text } = Typography;

interface HocKyCardProps {
    item: KyTucXa.IDanhSachMienKTX;
    selected: boolean;
    onClick: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const HocKyCard: React.FC<HocKyCardProps> = ({
    item,
    selected,
    onClick,
    onEdit,
    onDelete,
}) => {
    const isEnded = dayjs(item.hanNopMinhChung).isBefore(dayjs());

    const accentColor = '#125195';
    const successColor = '#52c41a';
    const endedColor = '#8c8c8c';

    let borderColor = '#f0f0f0';
    let backgroundColor = '#ffffff';
    let borderLeft = `4px solid ${successColor}`;
    let boxShadow = 'none';

    if (selected) {
        borderColor = accentColor;
        backgroundColor = '#e6f4ff';
        borderLeft = `4px solid ${accentColor}`;
        boxShadow = '0 4px 12px rgba(18, 81, 149, 0.15)';
    } else if (isEnded) {
        borderColor = '#d9d9d9';
        backgroundColor = '#fafafa';
        borderLeft = `4px solid ${endedColor}`;
    }

    return (
        <Card
            size="small"
            hoverable
            onClick={onClick}
            style={{
                marginBottom: 12,
                borderRadius: 10,
                height: 'auto',
                flex: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                borderColor,
                backgroundColor,
                boxShadow,
                borderLeft,
                position: 'relative',
                overflow: 'hidden',
            }}
            bodyStyle={{ padding: '14px' }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: 50 }}>
                    <Text
                        strong
                        style={{
                            fontSize: 15,
                            color: selected ? accentColor : '#262626',
                            lineHeight: '1.4',
                        }}
                    >
                        {item.tenHocKy || `Học kỳ ${item.maHocKy}`}
                    </Text>
                </div>

                <div style={{ display: 'flex', fontSize: 13, color: '#595959', width: '100%', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 4 }}>Mã HK:</span>
                    <Text style={{ fontWeight: 600, color: selected ? accentColor : '#595959' }}>
                        {item.maHocKy}
                    </Text>
                </div>

                <div style={{ display: 'flex', fontSize: 13, color: '#8c8c8c', width: '100%', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', marginRight: 4 }}>Hạn MC:</span>
                    <Text style={{ fontWeight: 500, color: isEnded ? '#ff4d4f' : '#595959' }}>
                        {item.hanNopMinhChung ? dayjs(item.hanNopMinhChung).format('HH:mm DD/MM/YYYY') : '--'}
                    </Text>
                </div>


                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    {isEnded ? (
                        <Tag color="default" style={{ margin: 0, borderRadius: 4, fontSize: 11 }}>
                            Đã kết thúc
                        </Tag>
                    ) : (
                        <Tag color="success" style={{ margin: 0, borderRadius: 4, fontSize: 11 }}>
                            Đang nhận minh chứng
                        </Tag>
                    )}
                </div>


                <div
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        gap: 2,
                        background: selected ? 'rgba(230, 244, 255, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 6,
                        padding: '2px',
                        backdropFilter: 'blur(2px)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            size="small"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 24,
                                height: 24,
                                color: '#1890ff'
                            }}
                            icon={<EditOutlined style={{ fontSize: 14 }} />}
                            onClick={onEdit}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa học kỳ này?"
                            onConfirm={onDelete}
                            okText="Có"
                            cancelText="Không"
                            placement="topRight"
                        >
                            <Button
                                type="text"
                                size="small"
                                danger
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 24,
                                    height: 24,
                                }}
                                icon={<DeleteOutlined style={{ fontSize: 14 }} />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </div>
            </div>
        </Card>
    );
};
