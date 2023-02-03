const axios = require("axios");
const fetchUser = async (email) => {
  try {
    const { data } = await axios.get(`${process.env.ADMISSION_URL}${email}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `dsdf446ihg ${process.env.ADMISSION_TOKEN}`,
      },
    });

    if (!data.length) throw new Error("Utilisateur Non Eligible");
    return data[0];
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

module.exports = fetchUser;
