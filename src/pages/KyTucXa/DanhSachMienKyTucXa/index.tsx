import { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import { useModel } from '@umijs/max';
import { HocKyList } from './components/HocKyList';
import { DanhSachSinhVienPanel } from './components/DanhSachSinhVienPanel';
import FormHocKy from './FormHocKy';

const DanhSachMienKyTucXa = () => {
    const {
        danhSach,
        getAllModel,
        loading,
        deleteModel,
        visibleForm,
        setVisibleForm,
        setRecord,
        edit,
        setEdit,
        handleEdit,
    } = useModel('kytucxa.danhsachmienkytucxa');

    const [selectedSemesterId, setSelectedSemesterId] = useState<string | undefined>(undefined);

    useEffect(() => {
        getAllModel();
    }, []);

    // Auto-select first semester on load, or reset/update selection if danhSach changes
    useEffect(() => {
        if (danhSach.length > 0) {
            if (!selectedSemesterId || !danhSach.some((item) => item._id === selectedSemesterId)) {
                setSelectedSemesterId(danhSach[0]._id);
            }
        } else {
            setSelectedSemesterId(undefined);
        }
    }, [danhSach]);

    const activeSemester = danhSach.find((item) => item._id === selectedSemesterId);

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[24, 24]}>
                {/* Left Panel - Semesters List */}
                <Col span={8}>
                    <HocKyList
                        dataSource={danhSach}
                        selectedSemesterId={selectedSemesterId}
                        onSelectSemester={setSelectedSemesterId}
                        loading={loading}
                        onAddClick={() => {
                            setEdit(false);
                            setRecord(undefined);
                            setVisibleForm(true);
                        }}
                        onEditClick={(item) => {
                            handleEdit(item);
                        }}
                        onDeleteClick={(id) => {
                            deleteModel(id, getAllModel);
                        }}
                    />
                </Col>

                {/* Right Panel - Exempt Students Panel */}
                <Col span={16}>
                    <DanhSachSinhVienPanel activeSemester={activeSemester} />
                </Col>
            </Row>

            {/* Modal for Add/Edit Semester Form */}
            <Modal
                open={visibleForm}
                title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} học kỳ`}
                width={550}
                onCancel={() => setVisibleForm(false)}
                destroyOnClose
                footer={null}
            >
                <FormHocKy />
            </Modal>
        </div>
    );
};

export default DanhSachMienKyTucXa;
