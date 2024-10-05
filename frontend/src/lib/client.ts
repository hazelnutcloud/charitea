import { treaty } from "@elysiajs/eden"
import type { App } from "server"

export const client = treaty<App>("http://localhost:3000")
