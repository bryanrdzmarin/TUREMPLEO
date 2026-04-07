import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  try {
    const plazas = await prisma.plaza.findMany({
      orderBy: { id: "desc" }
    });
    return Response.json(plazas);
  } catch (error) {
    console.error("Error fetching plazas:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener plazas" }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const data = await request.json() as { nombre: string; requisitos: string; funciones: string };
    
    if (!data.nombre || !data.requisitos || !data.funciones) {
      return new Response(
        JSON.stringify({ error: "Nombre, requisitos y funciones son obligatorios" }),
        { status: 400 }
      );
    }

    const plaza = await prisma.plaza.create({
      data: {
        nombre: data.nombre,
        requisitos: data.requisitos,
        funciones: data.funciones,
        activo: true
      }
    });

    return Response.json(plaza);
  } catch (error) {
    console.error("Error creating plaza:", error);
    return new Response(
      JSON.stringify({ error: "Error al crear plaza" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<Response> {
  try {
    const data = await request.json() as { id: number; nombre: string; requisitos: string; funciones: string; activo: boolean };
    
    if (!data.id || !data.nombre || !data.requisitos || !data.funciones) {
      return new Response(
        JSON.stringify({ error: "ID, nombre, requisitos y funciones son obligatorios" }),
        { status: 400 }
      );
    }

    const plaza = await prisma.plaza.update({
      where: { id: data.id },
      data: {
        nombre: data.nombre,
        requisitos: data.requisitos,
        funciones: data.funciones,
        activo: data.activo
      }
    });

    return Response.json(plaza);
  } catch (error) {
    console.error("Error updating plaza:", error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar plaza" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID es obligatorio" }),
        { status: 400 }
      );
    }

    await prisma.plaza.delete({
      where: { id: parseInt(id) }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting plaza:", error);
    return new Response(
      JSON.stringify({ error: "Error al eliminar plaza" }),
      { status: 500 }
    );
  }
}