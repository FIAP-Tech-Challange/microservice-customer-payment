import { SignInInputDto, SignInOutputDto } from '../../dtos/sign-in.dto';

export interface AuthPort {
  login(dto: SignInInputDto): Promise<SignInOutputDto>;
}
