const isProd = import.meta.env.PROD

export const logger = {
  error: (msg: string, err?: unknown) => {
    if (isProd) {
      console.error(`[CEC] ${msg}`)
    } else {
      console.error(`[CEC] ${msg}`, err)
    }
  },
  warn: (msg: string) => {
    if (!isProd) console.warn(`[CEC] ${msg}`)
  },
  info: (msg: string) => {
    if (!isProd) console.log(`[CEC] ${msg}`)
  },
}