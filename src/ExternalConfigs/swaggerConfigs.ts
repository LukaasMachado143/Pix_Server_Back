const fastifySwaggeroptions = {
  routePrefix: "/docs",
  exposeRoute: true,
  swagger: {
    info: {
      title: "Pix Sercver API",
      description: "Esta API foi criada com o intuito de aprendizado sobre vários conceitos e libs do node.",
      version: "1.0.0",
    },
    securityDefinitions: {
      bearerToken: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [
      {
        bearerToken: [],
      },
    ],
  },
};

const fastifySwaggerUIOptions = {
  routePrefix: "/docs",
  swagger: {
    url: "/docs/json",
    docExpansion: "none",
    deepLinking: false,
  },
};

export { fastifySwaggeroptions, fastifySwaggerUIOptions };
