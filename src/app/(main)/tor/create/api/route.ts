import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const tor = await prisma.tor.create({
    data: {
      judul: body.judul,
      bidangId: body.bidangId,
      creatorId: body.creatorId,
      status: "draft",
    },
  });

  return NextResponse.json({ id: tor.id });
}
