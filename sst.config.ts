/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "quill",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("quill", {
      domain: {
        name: "quill.it-t.xyz",
        dns: false,
        cert: "arn:aws:acm:us-east-1:319653899185:certificate/dde24c52-09e4-4058-b1d0-2a7769f24e3a",
      },
      environment: {
        GEMINI_KEY: process.env.GEMINI_KEY ?? "",
      },
    });
  },
});
