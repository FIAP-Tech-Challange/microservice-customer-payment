import { Injectable, Logger } from '@nestjs/common';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

@Injectable()
export class AwsSecretManagerService {
  private readonly logger = new Logger(AwsSecretManagerService.name);
  private readonly secretManagerClient: SecretsManagerClient;

  constructor() {
    this.secretManagerClient = new SecretsManagerClient();
  }

  async getSecretValue(secretId: string): Promise<string> {
    if (process.env.NODE_ENV === 'development') {
      this.logger.log(
        `Development mode: returning secret ID as secret value for ${secretId}`,
      );
      return secretId;
    }

    try {
      const response = await this.secretManagerClient.send(
        new GetSecretValueCommand({ SecretId: secretId }),
      );

      if (response?.SecretString) {
        return response.SecretString;
      }

      throw new Error('Secret string is empty');
    } catch (error) {
      this.logger.error(
        `Error retrieving secret value for secret ID: ${secretId}`,
        error as string,
      );
      throw error;
    }
  }
}
