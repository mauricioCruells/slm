export const getTokenExpiration = (): Date => {
  const refreshTokenLife = process.env.REFRESH_TOKEN_EXPIRATION;
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + Number(refreshTokenLife));
  return expiration;
};
