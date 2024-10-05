import { Elysia, t } from "elysia"
import { type ISuccessResult, type IVerifyResponse, verifyCloudProof } from "@worldcoin/idkit"
import { hashString } from "./hash"

export type App = typeof app

export const app = new Elysia()
  .post("/funds", async function verify({ body, error }) {
    const signal = JSON.stringify({ title: body.title, description: body.description, image: body.base64EncodedImage });
    const verifyRes: IVerifyResponse = await verifyCloudProof(body.worldIdData as ISuccessResult, 'app_staging_ac0a88ccb1edbf495b092c2408473e4d', 'create-fund', signal)
    if (verifyRes.success) {
      return true
    }
    return error(400, "authentication failed")
  }, {
    body: t.Object({
      worldIdData:t.Object({
        proof: t.String(),
        nullifier_hash: t.String(),
        merkle_root: t.String(),
        verification_level: t.String(),
        action: t.String(),
      }),
      base64EncodedImage: t.String(),
      title: t.String(),
      description: t.String()
    })
  }).compile()
