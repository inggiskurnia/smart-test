import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigEnvironment } from '../config/config.environment';
import { Logger } from 'winston';
import { Client } from 'minio';
import { MINIO_CLIENT } from './minio';

@Injectable()
export class MinioService {
  private SERVICE: string = MinioService.name;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @Inject(MINIO_CLIENT) private client: Client,
    private readonly config: ConfigEnvironment,
  ) {}

  private async ensureBucketExists(): Promise<void> {
    const exists = await this.client.bucketExists(this.config.minioBucket);
    if (!exists) {
      await this.client.makeBucket(this.config.minioBucket, 'us-east-1');
      this.logger.info(`bucket created ${this.config.minioBucket}`, {
        context: this.SERVICE,
      });
    }
  }

  public async uploadObject(
    folder: string,
    id: string,
    file: Express.Multer.File,
    bucket: string = this.config.minioBucket,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file received for upload');
    }

    if (!file.buffer) {
      throw new BadRequestException(
        `File buffer is missing for upload: ${file.originalname ?? 'unknown'}`,
      );
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const objectPath = `${folder}/${id}/${filename}`;

    try {
      await this.ensureBucketExists();

      await this.client.putObject(bucket, objectPath, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      });

      return objectPath;
    } catch (error: any) {
      this.logger.error('Failed to upload object to MinIO', {
        context: this.SERVICE,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        bucket,
        objectPath,
        error: error?.message ?? String(error),
      });

      throw new BadGatewayException(
        `Failed to upload file '${file.originalname}' to storage: ${error?.message ?? 'unknown error'}`,
      );
    }
  }

  public async listObjects(
    folder: string,
    bucket: string = this.config.minioBucket,
  ): Promise<string[]> {
    const objectList: string[] = [];
    const stream = this.client.listObjects(bucket, folder, true);
    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        objectList.push(this.getPublicUrl(obj.name, bucket));
      });
      stream.on('end', () => resolve(objectList));
      stream.on('error', (err) => reject(err));
    });
  }

  public getPublicUrl(
    objectPath: string,
    bucket: string = this.config.minioBucket,
  ): string {
    return `http://${this.config.minioHost}:${this.config.minioPort}/${bucket}/${objectPath}`;
  }

  public async getLinkObject(
    objectPath: string,
    download: boolean,
    bucket: string = this.config.minioBucket,
    expires?: 3600,
  ): Promise<string> {
    if (download) {
      return this.client.presignedGetObject(bucket, objectPath, expires, {
        'response-content-disposition': `attachment; filename="${objectPath.split('/').pop()}"`,
      });
    } else {
      return this.client.presignedGetObject(bucket, objectPath, expires);
    }
  }

  public async destroyObject(
    objectPath: string,
    bucket: string = this.config.minioBucket,
  ): Promise<void> {
    return this.client.removeObject(bucket, objectPath, { forceDelete: true });
  }

  public async destroyObjetByPrefix(
    prefix: string,
    bucket: string = this.config.minioBucket,
  ): Promise<void> {
    const objectsToDelete: string[] = [];

    const stream = this.client.listObjects(bucket, prefix, true);
    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        objectsToDelete.push(obj.name);
      });

      stream.on('end', async () => {
        if (objectsToDelete.length === 0) {
          return resolve();
        }
        try {
          await this.client.removeObjects(bucket, objectsToDelete);
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      stream.on('error', (err) => reject(err));
    });
  }
}
