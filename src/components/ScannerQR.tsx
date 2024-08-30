import React, { useEffect, useState } from 'react';
import { Scanner as ScannerComp, outline, boundingBox, centerText } from '@yudiel/react-qr-scanner';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { useAuth } from '../context/authContext';
import { AGREGAR_CODIGO_SCANEADO } from '../redux/slices/bodegaSlice';

const ScannerQR = ({handleScan}: {handleScan : (detectedCodes: any) => void}) => {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [scannedCode, setScannedCode] = useState<string>('');
  const device = useWindowSize();
  const [isChecking, setIsChecking] = useState(false);

  const styles = {
    container: {
      width: device.width <= 375 ? 320 : 380,
      height: 380,
      margin: 'auto'
    },
    controls: {
      marginBottom: 8
    }
  };

  return (
    <div className='w-full h-[400px] dark:bg-zinc-800 bg-zinc-100'>
      <ScannerComp
        formats={[
          'qr_code',
          'micro_qr_code',
          'rm_qr_code',
          'maxi_code',
          'pdf417',
          'aztec',
          'data_matrix',
          'matrix_codes',
          'dx_film_edge',
          'databar',
          'databar_expanded',
          'codabar',
          'code_39',
          'code_93',
          'code_128',
          'ean_8',
          'ean_13',
          'itf',
          'linear_codes',
          'upc_a',
          'upc_e'
        ]}
        constraints={{
          deviceId: deviceId
        }}
        onScan={handleScan}
        styles={styles}
        components={{
          audio: false,
          finder: true,
        }}
      />
    </div>
  );
};

export default ScannerQR;
