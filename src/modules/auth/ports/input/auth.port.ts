import { SignInInputDto, SignInOutputDto } from '../../models/dtos/sign-in.dto';

export interface AuthPort {
  login(dto: SignInInputDto): Promise<SignInOutputDto>;
}
