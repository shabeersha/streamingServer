export type JwtConfig = {
  secret: string;
  expiresIn: string;
};

export type Payload = {
  sub: string;
  username: string;
};

export const accessTokenConfig = (): JwtConfig => ({
  secret: process.env.ACCESS_TOKEN_SECRET,
  expiresIn: '10m',
});

export const refreshTokenConfig = (): JwtConfig => ({
  secret: process.env.REFRESH_TOKEN_SECRET,
  expiresIn: '8h',
});

export const adminRefreshTokenConfig = (): JwtConfig => ({
  secret: process.env.REFRESH_TOKEN_SECRET,
  expiresIn: '60d',
});
