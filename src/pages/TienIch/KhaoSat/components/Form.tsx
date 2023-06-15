import { useEffect, useState } from 'react';
import FormCauHinhBieuMau from './FormCauHinhBieuMau';
import FormThongTinChung from './FormThongTinChung';

const Form = () => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    setCurrent(0);
  }, []);

  return (
    <>
      <div>
        {current === 0 && <FormThongTinChung />}
        {current === 1 && <FormCauHinhBieuMau />}
      </div>
    </>
  );
};

export default Form;
