import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Empty, Tag, Popconfirm, Modal, Input, message, Alert, Tooltip } from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import fileDownload from 'js-file-download';
import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import { EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { EOperatorType } from '@/components/Table/constant';
import { ETrangThaiMienDangKyKTX, transTrangThaiMienDangKyKTX } from '@/services/KyTucXa/constant';
import type { KyTucXa } from '@/services/KyTucXa/typing';

interface DanhSachSinhVienPanelProps {
    activeSemester?: KyTucXa.IDanhSachMienKTX;
}

export const DanhSachSinhVienPanel: React.FC<DanhSachSinhVienPanelProps> = ({ activeSemester }) => {
    const {
        postMienDangKySinhVien,
        postDuyet,
        postTuChoi,
        deleteSinhVien,
        getSinhVien
    } = useModel('kytucxa.danhsachmienkytucxa');
    const { getAllModel: getAllCanBo } = useModel('tochucnhansu.nhansu');

    const [students, setStudents] = useState<any[]>([]);
    const [approverNames, setApproverNames] = useState<Record<string, string>>({});
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [visibleSelect, setVisibleSelect] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [actionType, setActionType] = useState<'duyet' | 'tuchoi'>('duyet');
    const [ghiChuDuyet, setGhiChuDuyet] = useState('');
    const [submittingAction, setSubmittingAction] = useState(false);

    const fetchStudents = async (id: string) => {
        setLoadingStudents(true);
        try {
            const res = await getSinhVien(id);
            const rawData = res?.data?.data?.result || res?.data?.data || res?.data || [];
            const data = Array.isArray(rawData) ? rawData : [];
            const list = data.map((item: any) => {
                let trangThaiMinhChung = item.trangThaiMinhChung;
                if (trangThaiMinhChung === 'Đã duyệt') {
                    trangThaiMinhChung = ETrangThaiMienDangKyKTX.DA_DUYET;
                } else if (trangThaiMinhChung === 'Chờ duyệt') {
                    trangThaiMinhChung = ETrangThaiMienDangKyKTX.CHO_DUYET;
                } else if (trangThaiMinhChung === 'Từ chối') {
                    trangThaiMinhChung = ETrangThaiMienDangKyKTX.TU_CHOI;
                }
                return {
                    _id: item._id,
                    code: item.maSinhVien,
                    username: item.maSinhVien,
                    fullname: item.hoTen || item.tenSinhVien || '',
                    khoaSinhVien: item.khoaSinhVien || '',
                    trangThaiMinhChung,
                    ghiChuDuyet: item.ghiChuDuyet || '',
                    urlMinhChung: item.urlMinhChung || '',
                    ssoId: item.ssoId || '',
                    nguoiDuyet: item.nguoiDuyet || '',
                };
            });
            setStudents(list);
            const ssoIds = Array.from(new Set(list.map((s) => s.nguoiDuyet).filter(Boolean))) as string[];
            if (ssoIds.length > 0) {
                getAllCanBo(
                    false,
                    undefined,
                    undefined,
                    [
                        {
                            field: 'ssoId',
                            operator: EOperatorType.INCLUDE,
                            values: ssoIds,
                        },
                    ],
                ).then((canBos) => {
                    const nameMap: Record<string, string> = {};
                    (canBos || []).forEach((cb: any) => {
                        if (cb.ssoId) {
                            nameMap[cb.ssoId] = `${cb.hoDem ?? ''} ${cb.ten ?? ''}`.trim() || cb.hoTen || '';
                        }
                    });
                    setApproverNames((prev) => ({ ...prev, ...nameMap }));
                }).catch((err) => {
                    console.error('Failed to fetch approver names:', err);
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        if (activeSemester?._id) {
            fetchStudents(activeSemester._id);
        } else {
            setStudents([]);
        }
    }, [activeSemester?._id]);

    const customImportConfig = {
        onDownloadTemplate: () => {
            const headers = [['TT', 'Mã sinh viên', 'Họ tên', 'Khoá sinh viên']];
            const worksheet = XLSX.utils.aoa_to_sheet(headers);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Mẫu');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fileDownload(blob, 'Mẫu nhập danh sách sinh viên miễn KTX.xlsx');
        },
        onImport: (file: File): Promise<any[]> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = e.target?.result;
                        const workbook = XLSX.read(data, { type: 'array' });
                        const ws = workbook.Sheets[workbook.SheetNames[0]];
                        const sheetData: any[] = XLSX.utils.sheet_to_json(ws);
                        const parsed = sheetData
                            .map((row: any) => {
                                const code = row['Mã sinh viên']?.toString()?.trim() || '';
                                const fullname = row['Họ tên']?.toString()?.trim() || '';
                                const khoa = row['Khoá sinh viên']?.toString()?.trim() || '';
                                return {
                                    code,
                                    username: code,
                                    fullname,
                                    khoaSinhVien: khoa,
                                    vaiTro: EVaiTroKhaoSat.SINH_VIEN,
                                };
                            })
                            .filter((item) => item.code);
                        resolve(parsed);
                    } catch (err) {
                        reject(err);
                    }
                };
                reader.onerror = (err) => reject(err);
                reader.readAsArrayBuffer(file);
            });
        },
    };

    const handleSetSelectedUsers = (val: any[]) => {
        const list = (val || []).map((u) => {
            const code = u.code || u.username;
            const existing = students.find((su) => su.code === code);
            return {
                ...u,
                code,
                username: code,
                fullname: u.fullname || u.hoTen || existing?.fullname || '',
                khoaSinhVien: u.khoaSinhVien || existing?.khoaSinhVien || '',
                _id: existing?._id,
                trangThaiMinhChung: existing?.trangThaiMinhChung,
                ghiChuDuyet: existing?.ghiChuDuyet || '',
                urlMinhChung: existing?.urlMinhChung || '',
            };
        });
        setSelectedUsers(list);
    };

    const handleAddStudentsDone = async (newStudents: { maSinhVien: string; hoTen: string }[]) => {
        if (!activeSemester?._id) return;
        try {
            const existingList = students.map((s) => ({
                maSinhVien: s.code,
                hoTen: s.fullname || '',
            }));
            const existingCodes = new Set(existingList.map((item) => item.maSinhVien));
            const uniqueNewStudents = newStudents.filter((item) => !existingCodes.has(item.maSinhVien));
            const combinedList = [...existingList, ...uniqueNewStudents];
            await postMienDangKySinhVien(activeSemester._id, combinedList);
            message.success('Thêm sinh viên thành công');
            setVisibleSelect(false);
            fetchStudents(activeSemester._id);
        } catch (err) {
            console.error(err);
            message.error('Thêm sinh viên thất bại');
        }
    };

    const onDeleteStudent = async (recordId: string) => {
        if (!activeSemester?._id) return;
        try {
            await deleteSinhVien(recordId);
            message.success('Xóa sinh viên thành công');
            fetchStudents(activeSemester._id);
        } catch (err) {
            console.error(err);
            message.error('Không thể xóa sinh viên');
        }
    };

    const handleActionClick = (record: any, type: 'duyet' | 'tuchoi') => {
        setCurrentRecord(record);
        setActionType(type);
        setGhiChuDuyet(record.ghiChuDuyet || '');
        setActionModalVisible(true);
    };

    const handleActionSubmit = async () => {
        if (!currentRecord?._id || !activeSemester?._id) return;
        setSubmittingAction(true);
        try {
            await postTuChoi(currentRecord._id, { ghiChuDuyet });
            message.success('Từ chối thành công');
            setActionModalVisible(false);
            setGhiChuDuyet('');
            setCurrentRecord(null);
            fetchStudents(activeSemester._id);
        } catch (err: any) {
            console.error(err);
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleApprove = async (record: any) => {
        if (!record?._id || !activeSemester?._id) return;
        try {
            await postDuyet(record._id);
            message.success('Duyệt thành công');
            fetchStudents(activeSemester._id);
        } catch (err: any) {
            console.error(err);
            message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const studentColumns = [
        {
            title: 'Mã SV',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullname',
            key: 'fullname',
            width: 180,
        },
        {
            title: 'Minh chứng',
            dataIndex: 'urlMinhChung',
            key: 'urlMinhChung',
            width: 180,
            render: (val: any) => {
                if (val) {
                    const filename = val.substring(val.lastIndexOf('/') + 1) || 'minh-chung.pdf';
                    return (
                        <a href={val} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#125195', fontWeight: 500 }}>
                            {filename}
                        </a>
                    );
                }
                return <span style={{ color: '#bfbfbf' }}>Chưa nộp</span>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThaiMinhChung',
            key: 'trangThaiMinhChung',
            width: 140,
            render: (val: any) => {
                switch (val) {
                    case ETrangThaiMienDangKyKTX.CHO_DUYET:
                        return <Tag color="warning" style={{ borderRadius: 4, padding: '2px 8px' }}>{transTrangThaiMienDangKyKTX[ETrangThaiMienDangKyKTX.CHO_DUYET]}</Tag>;
                    case ETrangThaiMienDangKyKTX.DA_DUYET:
                        return <Tag color="success" style={{ borderRadius: 4, padding: '2px 8px' }}>{transTrangThaiMienDangKyKTX[ETrangThaiMienDangKyKTX.DA_DUYET]}</Tag>;
                    case ETrangThaiMienDangKyKTX.TU_CHOI:
                        return <Tag color="error" style={{ borderRadius: 4, padding: '2px 8px' }}>{transTrangThaiMienDangKyKTX[ETrangThaiMienDangKyKTX.TU_CHOI]}</Tag>;
                    default:
                        return <Tag color="default" style={{ borderRadius: 4, padding: '2px 8px' }}>Chưa nộp</Tag>;
                }
            },
        },
        {
            title: 'Người duyệt',
            key: 'nguoiDuyet',
            width: 200,
            render: (text: any, record: any) => {
                const displayName = approverNames[record.nguoiDuyet] || record.nguoiDuyet || 'Admin';
                if (record.trangThaiMinhChung === ETrangThaiMienDangKyKTX.DA_DUYET) {
                    return (
                        <span style={{ color: '#262626', fontSize: '13px', fontWeight: 500 }}>
                            {displayName} {record.ssoId ? `(SSO: ${record.ssoId})` : ''}
                        </span>
                    );
                }
                if (record.trangThaiMinhChung === ETrangThaiMienDangKyKTX.TU_CHOI) {
                    return (
                        <span style={{ color: '#262626', fontSize: '13px', fontWeight: 500 }}>
                            {displayName} {record.ssoId ? `(SSO: ${record.ssoId})` : ''} {record.ghiChuDuyet ? ` - Lý do: ${record.ghiChuDuyet}` : ''}
                        </span>
                    );
                }
                return null;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 110,
            render: (text: any, record: any) => {
                return (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Tooltip title="Duyệt">
                            <Popconfirm
                                title="Xác nhận duyệt miễn giảm KTX cho sinh viên này?"
                                onConfirm={() => handleApprove(record)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button
                                    type="text"
                                    size="small"
                                    style={{ color: '#52c41a' }}
                                    icon={<CheckOutlined />}
                                />
                            </Popconfirm>
                        </Tooltip>
                        <Tooltip title="Từ chối">
                            <Button
                                type="text"
                                danger
                                size="small"
                                onClick={() => handleActionClick(record, 'tuchoi')}
                                icon={<CloseOutlined />}
                            />
                        </Tooltip>
                        <Popconfirm
                            title="Xóa sinh viên này khỏi danh sách miễn?"
                            onConfirm={() => onDeleteStudent(record._id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} size="small" style={{ marginLeft: 'auto' }} />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    if (!activeSemester) {
        return (
            <Card
                style={{
                    height: '100%',
                    borderRadius: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                }}
            >
                <Empty description="Vui lòng chọn học kỳ ở danh sách bên trái" />
            </Card>
        );
    }

    const isEnded = dayjs(activeSemester.hanNopMinhChung).isBefore(dayjs());

    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <span style={{ fontWeight: 700, fontSize: '15px', color: '#262626' }}>
                            Sinh Viên Miễn KTX – HK {activeSemester.maHocKy}
                        </span>
                        <div style={{ fontSize: 13, fontWeight: 'normal', color: '#595959', marginTop: 4 }}>
                            {activeSemester.tenHocKy}
                        </div>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setSelectedUsers([]);
                            setVisibleSelect(true);
                        }}
                        style={{ backgroundColor: '#125195', borderColor: '#125195', borderRadius: 6 }}
                    >
                        Thêm sinh viên
                    </Button>
                </div>
            }
            style={{
                height: '100%',
                borderRadius: 10,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
            }}
            bodyStyle={{ padding: '16px', height: 'calc(100vh - 200px)', overflowY: 'auto' }}
        >
            <div style={{ marginBottom: 16 }}>
                {isEnded ? (
                    <Alert
                        message="Học kỳ này đã kết thúc thời gian nộp minh chứng."
                        type="warning"
                        showIcon
                        style={{ borderRadius: 6 }}
                    />
                ) : (
                    <Alert
                        message={`Hạn chót nộp minh chứng: ${activeSemester.hanNopMinhChung ? dayjs(activeSemester.hanNopMinhChung).format('HH:mm DD/MM/YYYY') : '--'}`}
                        type="info"
                        showIcon
                        style={{ borderRadius: 6 }}
                    />
                )}
            </div>

            <Table
                dataSource={students}
                columns={studentColumns}
                rowKey="code"
                size="middle"
                pagination={{ pageSize: 10, showSizeChanger: true }}
                loading={loadingStudents}
                bordered
                locale={{ emptyText: 'Chưa có sinh viên nào trong danh sách' }}
                style={{
                    borderRadius: 8,
                    overflow: 'hidden'
                }}
            />

            {/* Table select student modal */}
            <Modal
                open={visibleSelect}
                onCancel={() => setVisibleSelect(false)}
                title={
                    <span style={{ fontWeight: 700, fontSize: 16 }}>
                        Chọn/nhập danh sách sinh viên miễn KTX – HK {activeSemester?.maHocKy || ''}
                    </span>
                }
                width={950}
                footer={null}
                destroyOnClose
            >
                <div style={{ padding: '8px 0' }}>
                    <TableSelectUser
                        type={EVaiTroKhaoSat.SINH_VIEN}
                        selectedUsers={selectedUsers}
                        setSelectedUsers={handleSetSelectedUsers}
                        customImport={customImportConfig}
                        customStudentColumn={{
                            title: 'Khoá sinh viên',
                            dataIndex: 'khoaSinhVien',
                        }}
                        singleTable={true}
                    />
                    <div style={{ textAlign: 'right', marginTop: 20 }}>
                        <Button
                            onClick={() => {
                                const newStudents = (selectedUsers ?? []).map((u: any) => ({
                                    maSinhVien: u.code,
                                    hoTen: u.fullname || '',
                                })).filter((item) => item.maSinhVien);
                                handleAddStudentsDone(newStudents);
                            }}
                            type="primary"
                            style={{ backgroundColor: '#125195', borderColor: '#125195', borderRadius: 6, padding: '0 24px' }}
                        >
                            Chọn xong
                        </Button>
                    </div>
                </div>
            </Modal>


            <Modal
                open={actionModalVisible}
                title={
                    <span style={{ fontWeight: 700, fontSize: 16 }}>
                        Từ chối miễn giảm KTX
                    </span>
                }
                okText="Xác nhận"
                cancelText="Hủy"
                confirmLoading={submittingAction}
                onOk={handleActionSubmit}
                onCancel={() => {
                    setActionModalVisible(false);
                    setGhiChuDuyet('');
                    setCurrentRecord(null);
                }}
                okButtonProps={{
                    style: {
                        backgroundColor: '#ff4d4f',
                        borderColor: '#ff4d4f',
                        borderRadius: 6
                    }
                }}
                cancelButtonProps={{
                    style: { borderRadius: 6 }
                }}
            >
                <div style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 12, fontSize: 14 }}>
                        Sinh viên: <strong>{currentRecord?.fullname || ''}</strong> ({currentRecord?.code || ''})
                    </div>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Lý do từ chối:</div>
                    <Input.TextArea
                        rows={4}
                        value={ghiChuDuyet}
                        onChange={(e) => setGhiChuDuyet(e.target.value)}
                        placeholder="Nhập lý do từ chối..."
                        style={{ borderRadius: 6 }}
                    />
                </div>
            </Modal>
        </Card>
    );
};
