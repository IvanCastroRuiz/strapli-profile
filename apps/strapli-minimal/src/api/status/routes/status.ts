export default {
  routes: [
    {
      method: "GET",
      path: "/status",
      handler: "status.index",
      config: {
        auth: false,
      },
    },
  ],
};
