import { HttpError } from "./../../../../lib/http";
import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = await cookies();
  try {
    const { payload } = await authApiRequest.sLogin(body);
    const { accessToken, refreshToken } = payload.data;
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
    console.log(decodedAccessToken, decodedRefreshToken);
    cookieStore.set("accessToken", accessToken, {
      path: "/", // bắt đầu với dấu / thì nó sẽ được gửi đi ở mọi đường dẫn
      expires: decodedAccessToken.exp * 1000,
      // Session mặc định khi không cài đặt expire: 1 phiên 1 phiên duy trì cho đến khi tắt trình duyệt
      sameSite: "lax", // none, strict
      secure: true, // nếu để true thì chỉ gửi cookie khi kết nối qua https
      httpOnly: true, // không cho client truy cập cookie thông qua document.cookie
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      expires: decodedRefreshToken.exp * 1000,
      secure: true,
      sameSite: "lax",
      httpOnly: true,
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json(
        {
          message: "có lỗi xảy ra",
        },
        { status: 500 }
      );
    }
  }
}
