import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select Mức thu để cho vào FormItem
 */
const SelectMucThu = (props: {
    value?: string;
    onChange?: (id: string) => void;
    multiple?: boolean;
    condition?: any;
    allowClear?: boolean;
    style?: React.CSSProperties;
    isSetRecord?: boolean;
    selectMa?: boolean;
}) => {
    const { value, onChange, multiple, condition, allowClear, style, isSetRecord } = props;
    const { danhSach, getAllModel, setRecord, loading } = useModel('kytucxa.mucthu');

    useEffect(() => {
        getAllModel(undefined, undefined, condition).then(() => {
            if (!isSetRecord) setRecord(undefined);
        });
    }, [JSON.stringify(condition)]);

    return (
        <Select
            mode={multiple ? 'multiple' : undefined}
            value={value}
            onChange={onChange}
            options={danhSach.map((item) => ({
                key: item._id,
                value: item.ma,
                label: `${item.name}`,
            }))}
            showSearch
            optionFilterProp='label'
            placeholder='Chọn mức thu'
            allowClear={allowClear ?? false}
            style={{ width: '100%', ...style }}
            loading={loading}
        />
    );
};

export default SelectMucThu;
