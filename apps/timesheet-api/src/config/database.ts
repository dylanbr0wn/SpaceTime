import sql from "mssql";
import config from "./config";

//Get config depending on environment
const creds = config.database_creds;

const connectionPool = new sql.ConnectionPool(creds);

// Initialize connection pool
export const getPool = async () => {
  return await connectionPool.connect();
};

export type DatabaseResponse = {
  success: boolean;
  data: any | null;
  message: string;
  status: number;
};
