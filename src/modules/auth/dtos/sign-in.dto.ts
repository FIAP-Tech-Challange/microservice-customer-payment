export interface SignInInputDto {
  email: string;
  password: string;
}

export interface SignInOutputDto {
  access_token: string;
}
