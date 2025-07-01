// import dotenv from 'dotenv'
class Configure {
  public AUTH_SERVICE_HOST: string | undefined;
  public AUTH_SERVICE_PORT: number | undefined;
  public USER_SERVICE_HOST: string | undefined;
  public USER_SERVICE_PORT: number | undefined;
  constructor() {
    this.AUTH_SERVICE_HOST = process.env.AUTH_SERVICE_HOST || '';
    this.AUTH_SERVICE_PORT = parseInt(process.env.AUTH_SERVICE_PORT);
    this.USER_SERVICE_HOST = process.env.AUTH_SERVICE_HOST || '';
    this.USER_SERVICE_PORT = parseInt(process.env.AUTH_SERVICE_PORT);
  }
}

export const configure = new Configure();
