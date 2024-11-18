import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  // cookies() trả về Promise, cần sử dụng await.
  const cookieStore = await cookies();

  // Lấy giá trị accessToken và refreshToken từ cookies.
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

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

    // Xóa cookies nếu tồn tại.
    if (accessToken) {
      cookieStore.delete("accessToken");
    }
    if (refreshToken) {
      cookieStore.delete("refreshToken");
    }
    return Response.json(result.payload);
  } catch (error) {
    // Trả về phản hồi thành công nếu có cả accessToken và refreshToken.
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
