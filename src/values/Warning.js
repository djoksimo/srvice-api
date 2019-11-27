module.exports = {
  print: () => ({
    unspecifiedDB: () => {
      console.log("\x1b[31m", `DB NOT SPECIFIED ⚠️  ⚠️  ⚠️\n\n`);
      console.log("\x1b[36m", `To fix on Linux or Mac:\n`);
      console.log("\x1b[37m", `export NODE_ENV="<ENVIRONMENT-NAME>" \n\n e.g. export NODE_ENV="TEST"\n\n`);
      console.log("\x1b[36m", "To fix on Windows:\n");
      console.log("\x1b[37m", `setx NODE_ENV "<ENVIRONMENT-NAME>" \n\n e.g. set NODE_ENV "TEST"`);
      process.exit(1);
    },
    currentDB: () => {
      const env = process.env.NODE_ENV || "INVALID";
      console.log(`USING ${env} DB!!! ⚠️\n`);
    },
  }),
};
