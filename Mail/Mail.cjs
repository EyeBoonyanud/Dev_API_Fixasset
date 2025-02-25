

const AVO = {
    user: "avo",
    password: "avo",
    connectString: "TCIX01",
  };



  const oracledb = require("oracledb");
  const nodemailer = require('nodemailer');
  // oracledb.initOracleClient({
  //     tnsAdmin: "D:\\app\\Administrator\\product\\11.2.0\\client_1\\network\\admin",
    
  //   });
  
  

  module.exports.getMailshow = async (req, res) => {
    try {
      const { Name } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
        SELECT DISTINCT FPM_EMAIL , USER_FNAME ||' '|| USER_SURNAME  
        FROM FAM_PERSON_MASTER 
        LEFT JOIN CUSR.CU_USER_M cum ON USER_LOGIN = FPM_USER_LOGIN 
        WHERE FPM_USER_LOGIN ='${Name}'
      `;
      const result = await connect.execute(query);
      connect.release();
      let Email = []
      let dataName = []
    for (let i = 0; i < result.rows.length; i++) {
      let F_Email = result.rows[i][0];
      let F_Name = result.rows[i][1];
      Email.push(F_Email)
      dataName.push(F_Name)
  }
      res.status(200).json({ dataEmail: Email, rowName : dataName ,message : "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };

  module.exports.getType_mail = async (req, res) => {
    try {
      const { Type_show } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT FCM_DESC FROM FAM_CODE_MASTER WHERE FCM_CODE ='${Type_show}'
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };

  
  module.exports.getName_To = async (req, res) => {
    try {
      const { name } = req.body;
 
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT USER_TITLE || ' ' || USER_FNAME || ' ' || USER_SURNAME  FROM CUSR.CU_USER_M WHERE USER_LOGIN = '${name}'
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };

  module.exports.getStatus_Mail = async (req, res) => {
    try {
      const { sts } = req.body;
        const connect = await oracledb.getConnection(AVO);
        const query = `
        SELECT FFM_DESC  FROM FAM_FLOW_MASTER WHERE FFM_CODE = '${sts}'
        `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };
  // เพิ่มล่าสุดวันที่ 04/04/2024
  module.exports.get_req_mail = async (req, res) => {
    try {
      const { Name } = req.body;
      const connect = await oracledb.getConnection(AVO);
      const query = `
      SELECT DISTINCT FPM_EMAIL , USER_FNAME ||' '|| USER_SURNAME  
      FROM FAM_PERSON_MASTER 
      LEFT JOIN CUSR.CU_USER_M cum ON USER_LOGIN = FPM_USER_LOGIN 
      WHERE FPM_USER_LOGIN ='${Name}'
      `;
  
      const result = await connect.execute(query);
    
      connect.release();
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  };