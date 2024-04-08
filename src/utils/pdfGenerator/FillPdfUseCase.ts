import fs from 'fs';
import fontFormat from './FontCustom';
import { alignText } from './AlignText';
import { fixTextSize } from './FixTextSize';
import { generateQrCode } from './GenerateQR';
import { PDFDocument, degrees, rgb } from 'pdf-lib';
import GetActiveTemplateUseCase from '../../templates/useCases/templates/GetActiveTemplateUseCase';

class FillPdfUseCase {
  drawFormat(type, value, coordinate, pdfDoc, index, customFont, config, upperCase, qrImage) {
    const pages = pdfDoc.getPages();
    const pageToUpdate = pages[index];
    const { height, width } = pageToUpdate.getSize();
    const { x, y, size, rotate = 0, color, lengths = [], newLines, aligment = 'left', width: widthCoordinate, height: heightCoordinate } = coordinate;
    let fixSize = size;
    let fixX = x;
  
    switch (type) {
      case 'qr':
        pageToUpdate.drawImage(qrImage, {
          x: x,
          y: height - y - heightCoordinate,
          width: widthCoordinate,
          height: heightCoordinate,
        });
        break;
      case 'text':
      default:
        if(!value && !config.required) break;
        if(upperCase) value = value.toUpperCase();
        if(aligment !== 'left') fixX = alignText({ width, value, customFont, size, x });
        if(lengths.length) {
          const { newValue, newSize } = fixTextSize({ value, lengths, newLines, size });
          value = newValue;
          fixSize = newSize;
        }

        pageToUpdate.drawText( value, {
          x: fixX,
          y: height - size - y,
          rotate: degrees(rotate),
          size: lengths.length ? fixSize : size,
          font: customFont,
          color: rgb(color[0], color[1], color[2]),
          lineHeight: size,
        });
        break;
    }
  }

  async addignValuesToPDF(file, coordinates, values, config, qrGenerated)  {
    const { upperCase, font } = config;
    const pdfDoc = await PDFDocument.load(file);
    const qrImage = await pdfDoc.embedPng(qrGenerated);
    const customFont = await fontFormat(pdfDoc, font);

    coordinates.map((coordenatesBypage, index) => {
      coordenatesBypage.map((coordinateData) => {
        const { name, config: configCoordenate } = coordinateData;  
        const value = values[name];
        this.drawFormat(configCoordenate?.type, value, coordinateData, pdfDoc, index, customFont, configCoordenate, upperCase, qrImage)
      });
    })

    return await pdfDoc.save();
  }

  async exec(values) {
    const getActiveTemplateUseCase = new GetActiveTemplateUseCase();
    const template = await getActiveTemplateUseCase.exec();
    const { pdf, coordinates, config } = template;
    const qrGenerated = await generateQrCode(values);
    const uiArrayPdf = await this.addignValuesToPDF(pdf, coordinates, values, config, qrGenerated);
    fs.writeFileSync('testFinish.pdf', uiArrayPdf); // descomentar solo para probar en local
    const bufferPDF = Buffer.from(uiArrayPdf.buffer);
    return bufferPDF;
  }
}

export default FillPdfUseCase;
