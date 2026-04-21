import { BadRequestException } from '@nestjs/common';

export const fileFilter = (req, file: Express.Multer.File, cb) => {
  const allowedMime = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    // CSV / spreadsheet
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.spreadsheet',
    // Presentation
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.oasis.opendocument.presentation',
    // Word / document
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
  ];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const rejectedFormat = file?.mimetype || file?.originalname || 'unknown';
    cb(
      new BadRequestException(
        `The given file format is not accepted: ${rejectedFormat}`,
      ),
      false,
    );
  }
};

export const limitFile = {
  fileSize: 2 * 1024 * 1024, // 3mb
};
