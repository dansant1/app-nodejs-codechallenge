import {
    Injectable,
    ValidationPipe,
    ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class KafkaValidationPipe extends ValidationPipe {
    public async transform(value: any, metadata: ArgumentMetadata) {
        console.log('VALUE=', value);
        console.log('METADATA=', metadata);
        return await super.transform(value, metadata);
    }
}