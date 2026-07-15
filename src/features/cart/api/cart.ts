import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  addCourseToCart,
  getCartCoursesForUser,
  getCartTotal,
  removeCourseFromCart,
} from "@/features/cart/services/cart.service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getCartCoursesForUser(session.user.id);

  return NextResponse.json({
    items,
    total: getCartTotal(items),
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const courseId = typeof body.courseId === "string" ? body.courseId : "";

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  await addCourseToCart(session.user.id, courseId);

  const items = await getCartCoursesForUser(session.user.id);

  return NextResponse.json({
    items,
    total: getCartTotal(items),
  });
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const courseId = typeof body.courseId === "string" ? body.courseId : "";

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  await removeCourseFromCart(session.user.id, courseId);

  const items = await getCartCoursesForUser(session.user.id);

  return NextResponse.json({
    items,
    total: getCartTotal(items),
  });
}
