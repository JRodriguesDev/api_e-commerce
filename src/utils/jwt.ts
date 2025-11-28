import 'dotenv/config'
import {SignJWT, jwtVerify, type JWTPayload} from 'jose'

export const generate_token = async (payload: JWTPayload) => {
    const secret = new TextEncoder().encode(process.env.JWT_PASSWORD)
    return await new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .sign(secret)
}

export const verify_token = async (token: string) => {
    const secret = new TextEncoder().encode(process.env.JWT_PASSWORD)
    return await jwtVerify(token, secret)
}