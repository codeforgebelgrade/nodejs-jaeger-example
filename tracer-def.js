const initTracer = require("jaeger-client").initTracer;

const config = {
  serviceName: "simple-api-request",
  sampler: {
    type: "const",
    param: 1,
  },
  reporter: {
    logSpans: true,
  },
};
const options = {
  logger: {
    info(msg) {
      console.log("INFO ", msg);
    },
    error(msg) {
      console.log("ERROR", msg);
    },
  },
};

const tracer = initTracer(config, options);

module.exports = {
    tracer
}
