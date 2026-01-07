import { Injectable, Logger } from '@nestjs/common';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

@Injectable()
export class AwsParameterStoreService {
  private readonly logger = new Logger(AwsParameterStoreService.name);
  private readonly parameterStoreClient: SSMClient;

  constructor() {
    this.parameterStoreClient = new SSMClient();
  }

  async getParameter(parameterName: string): Promise<string> {
    if (process.env.NODE_ENV === 'development') {
      this.logger.log(
        `Development mode: returning parameter name as parameter value for ${parameterName}`,
      );
      return parameterName;
    }

    try {
      const response = await this.parameterStoreClient.send(
        new GetParameterCommand({ Name: parameterName, WithDecryption: true }),
      );

      if (response?.Parameter?.Value) {
        return response.Parameter.Value;
      }

      throw new Error(
        `Parameter value is empty for parameter name: ${parameterName}`,
      );
    } catch (error) {
      this.logger.error(
        `Error retrieving parameter value for parameter name: ${parameterName}`,
        error as string,
      );
      throw error;
    }
  }
}
