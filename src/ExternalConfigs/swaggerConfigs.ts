const fastifySwaggeroptions = {
  routePrefix: "/docs",
  exposeRoute: true,
  swagger: {
    info: {
      title: "Sua API",
      description: "Descrição da sua API",
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
