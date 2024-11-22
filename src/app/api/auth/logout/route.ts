import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  // cookies() trả về Promise, cần sử dụng await.
  const cookieStore = await cookies();

  // Lấy giá trị accessToken và refreshToken từ cookies.
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
  // Kiểm tra nếu không nhận được accessToken hoặc refreshToken.
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Không nhận được accessToken hoặc refreshToken",
      },
      {
        status: 200,
      }
    );
  }

  try {
    const result = await authApiRequest.sLogout({ accessToken, refreshToken });
    return Response.json(result.payload);
  } catch (error) {
    return Response.json(
      {
        message: "Lỗi API khi thực hiện logout server backend",
      },
      {
        status: 200,
      }
    );
  }
}
