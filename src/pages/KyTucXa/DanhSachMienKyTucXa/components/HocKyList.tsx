import { Card, Button, Badge, Empty, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { HocKyCard } from './HocKyCard';
import type { KyTucXa } from '@/services/KyTucXa/typing';

interface HocKyListProps {
    dataSource: KyTucXa.IDanhSachMienKTX[];
    selectedSemesterId?: string;
    onSelectSemester: (id: string) => void;
    loading?: boolean;
    onAddClick: () => void;
    onEditClick: (item: KyTucXa.IDanhSachMienKTX) => void;
    onDeleteClick: (id: string) => void;
}

export const HocKyList: React.FC<HocKyListProps> = ({
    dataSource,
    selectedSemesterId,
    onSelectSemester,
    loading,
    onAddClick,
    onEditClick,
    onDeleteClick,
}) => {
    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '15px', color: '#262626' }}>
                            DANH SÁCH HỌC KỲ
                        </span>
                        <Badge 
                            count={dataSource.length} 
                            style={{ 
                                backgroundColor: '#e6f4ff', 
                                color: '#125195', 
                                border: '1px solid #91caff',
                                fontWeight: 'bold' 
                            }} 
                        />
                    </div>
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        style={{ 
                            borderRadius: 6,
                            backgroundColor: '#125195',
                            borderColor: '#125195',
                            fontSize: 12,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        onClick={onAddClick}
                    >
                        Thêm học kỳ
                    </Button>
                </div>
            }
            style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 10,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
            }}
            bodyStyle={{ 
                padding: '12px 16px', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden' 
            }}
        >
            <div
                style={{
                    maxHeight: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                    paddingRight: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                }}
                className="custom-scrollbar"
            >
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                        <Spin size="default" />
                    </div>
                ) : dataSource.length === 0 ? (
                    <Empty description="Chưa có học kỳ nào" style={{ marginTop: 40 }} />
                ) : (
                    dataSource.map((item) => (
                        <HocKyCard
                            key={item._id}
                            item={item}
                            selected={selectedSemesterId === item._id}
                            onClick={() => onSelectSemester(item._id)}
                            onEdit={() => onEditClick(item)}
                            onDelete={() => onDeleteClick(item._id)}
                        />
                    ))
                )}
            </div>
            
            {/* Custom styled scrollbar injection */}
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e8e8e8;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cccccc;
                }
            `}} />
        </Card>
    );
};
