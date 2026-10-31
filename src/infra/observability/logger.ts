import pino from 'pino'

const log = pino({
  level: 'debug',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          name: 'dev-terminal',
          colorize: true,
          levelFirst: true,
          include: 'level,time',
          translateTime: 'yyyy-mm-dd HH:MM ss Z',
        },
      },
      {
        target: 'pino-opentelemetry-transport',
        level: 'info',
        options: {
          loggerName: 'upload-server',
          serviceVersion: '1.0.0',
        },
      },
    ],
  },
})

export { log }
