import jwt from "jsonwebtoken";
import accountApiRequest from "@/apiRequests/account";
import { ChangePasswordV2BodyType } from "@/schemaValidations/account.schema";
import { cookies } from "next/headers";
import { ENTITY_ERROR_STATUS, EntityError } from "@/lib/http";

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const body = (await request.json()) as ChangePasswordV2BodyType;
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken)
    return Response.json(
      { message: "Không tìm thấy accessToken" },
      { status: 401 }
    );
  try {
    const response = await accountApiRequest.sChangePasswordV2(
      accessToken,
      body
    );
    const decodedAccessToken = jwt.decode(
      response.payload.data.accessToken
    ) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(
      response.payload.data.refreshToken
    ) as {
      exp: number;
    };
    cookieStore.set("accessToken", response.payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", response.payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(response.payload, { status: 200 });
  } catch (error: any) {
    if (error instanceof EntityError) {
      return Response.json(
        {
          message: error.payload.message,
          errors: error.payload.errors,
          status: error.status,
        },
        { status: error.status }
      );
    }
    return Response.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}
