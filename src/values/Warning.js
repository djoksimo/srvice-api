module.exports = {
  print: () => {
    console.log("WARNING ⚠️⚠️⚠️");
    return {
      unspecifiedDB: () => {
        console.log("\x1b[31m", "DB NOT SPECIFIED ⚠️  ⚠️  ⚠️\n\n");
        console.log("\x1b[36m", "Check https://srvice.slite.com");
        process.exit(1);
      },
      currentDB: () => {
        const env = process.env.NODE_ENV || "INVALID";
        console.log(`USING ${env} DB!!! ⚠️\n`);
      },
    };
  },
};
