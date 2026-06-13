import * as QRCode from 'qrcode';

interface QROptions {
  width?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

const DEFAULTS: QROptions = {
  width: 300,
  color: {
    dark: '#000',
    light: '#0000',
  },
};

export const generateQrCode = async (data: any, options: QROptions = {}) => {
  const config = {
    ...DEFAULTS,
    ...options,
    color: { ...DEFAULTS.color, ...(options.color || {}) },
  };

  const qrData = typeof data === 'string' ? data : (data.qrData || JSON.stringify(data));

  const qrImage = await QRCode.toBuffer(qrData, {
    type: 'png',
    width: config.width,
    color: config.color,
  });

  return qrImage;
};