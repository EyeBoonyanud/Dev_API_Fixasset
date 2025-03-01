const express = require("express");
const oracledb = require("oracledb");

const app = express();



app.use(express.json());
const CUSR = {
  user: "cusr",
  password: "cusr",
  connectString: "TCIX01",
};


module.exports.login = async (req, res) => {
  try {
    const { User, Password } = req.body;
    const connect = await oracledb.getConnection(CUSR);
    const query = `
    SELECT R.ROLE_ID ,T.USER_FNAME , T.USER_SURNAME , T.USER_LOGIN 
    ,T.USER_EMP_ID , REPLACE(R.ROLE_NAME,'FAS-','') AS ROLE_NAME_SHOW,
    T.USER_COSTCENTER AS COSTCENTER
    FROM CU_USER_M T
    INNER JOIN CU_ROLE_USER RU ON RU.USER_LOGIN = T.USER_LOGIN
    INNER JOIN CU_ROLE_M R ON R.ROLE_ID = RU.ROLE_ID
    WHERE  UPPER(T.USER_LOGIN)= UPPER('${User}')
    AND UPPER(T.USER_PASSWORD) = UPPER('${Password}')
    AND R.SYSTEM_ID = '65'
    `;

    const result = await connect.execute(query);
    connect.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "An error occurred while sending email" });
  }
};

//Menu
module.exports.menu = async function (req, res) {
  try {
    const  Userlogin  = req.query.userlogin;
    const  Role  = req.query.role;
    const connect = await oracledb.getConnection(CUSR);
    const query = 
    `SELECT DISTINCT M.MENU_ID,
                M.MENU_NAME,
                M.MENU_DESC,
                M.MENU_PARENT_ID,
                M.MENU_SORT
                FROM CU_ROLE_USER T
                INNER JOIN CU_ROLE_M R ON R.ROLE_ID = T.ROLE_ID
                LEFT JOIN CU_ROLE_MENU RM ON RM.ROLE_ID = T.ROLE_ID
                LEFT JOIN CU_MENU_M M ON M.MENU_ID = RM.MENU_ID AND M.SYSTEM_ID = R.SYSTEM_ID
                WHERE T.USER_LOGIN = '${Userlogin}' 
                AND R.SYSTEM_ID = '65'
                ORDER BY CAST(M.MENU_ID AS INTEGER),CAST(M.MENU_PARENT_ID AS INTEGER),M.MENU_SORT`;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
    
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};

module.exports.mainmenu = async function (req, res) {
  try {
    const connect = await oracledb.getConnection(CUSR);
    const query = 
    `SELECT DISTINCT M.MENU_ID,
    M.MENU_NAME,
    M.MENU_DESC,
    M.MENU_PARENT_ID,
    M.MENU_SORT
FROM CU_ROLE_USER T
INNER JOIN CU_ROLE_M R ON R.ROLE_ID = T.ROLE_ID
LEFT JOIN CU_ROLE_MENU RM ON RM.ROLE_ID = T.ROLE_ID
LEFT JOIN CU_MENU_M M ON M.MENU_ID = RM.MENU_ID AND M.SYSTEM_ID = R.SYSTEM_ID
AND R.SYSTEM_ID = '65'
AND M.MENU_PARENT_ID IS NULL 
ORDER BY CAST(M.MENU_ID AS INTEGER),CAST(M.MENU_PARENT_ID AS INTEGER),M.MENU_SORT`;
    const result = await connect.execute(query);
    connect.release();
    res.json(result.rows);
    
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};
module.exports. submenu = async function (req, res) {
  try {
    const { userlogin } = req.body;
    const connect = await oracledb.getConnection(CUSR);
    const query = `
    SELECT DISTINCT M.MENU_ID,
    M.MENU_NAME,
    M.MENU_DESC,
    M.MENU_PARENT_ID,
    M.MENU_SORT
    FROM CU_ROLE_USER T
    INNER JOIN CU_ROLE_M R ON R.ROLE_ID = T.ROLE_ID
    LEFT JOIN CU_ROLE_MENU RM ON RM.ROLE_ID = T.ROLE_ID
    LEFT JOIN CU_MENU_M M ON M.MENU_ID = RM.MENU_ID AND M.SYSTEM_ID = R.SYSTEM_ID
    WHERE T.USER_LOGIN = '${userlogin}'
    AND R.SYSTEM_ID = '65'
    AND M.MENU_PARENT_ID IS NOT NULL 
    ORDER BY CAST(M.MENU_ID AS INTEGER),CAST(M.MENU_PARENT_ID AS INTEGER),M.MENU_SORT`;
           
          const result = await connect.execute(query);
    
          connect.release();

    res.json(result.rows);
  } catch (error) {
    // console.error("ข้อผิดพลาดในการค้นหาข้อมูล:", error.message);
  }
};


