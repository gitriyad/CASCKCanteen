process.env.secretKey =
  "Civil Aviation College(CASC) Canteen Management Software. Developed by Md. Nurul Huda Riyad(Lec, ICT)";
// process.env.connectionString =
//   "mongodb+srv://riyad303030:a2tQE1qXl9Aa0Woa@cluster0.5z6riau.mongodb.net/canteen";
//process.env.connectionString = "mongodb://127.0.0.1:27017/canteen";
// process.env.connectionString = "mongodb://103.148.15.38:27017/canteen";
//this is the secure mongoConnectionString
process.env.connectionString =
  "mongodb://casckCanteenAdminUser1:casck1234canteenAdminUser1@103.148.15.38:31716/canteen";
module.exports = process.env;
