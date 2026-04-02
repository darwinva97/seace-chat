import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "RUC/DNI y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Petición real a SEACE
    const seaceRes = await fetch("https://prod6.seace.gob.pe/v1/s8uit-services/seguridadproveedor/seguridad/validausuariornp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password })
    });

    const data = await seaceRes.json();

    if (!seaceRes.ok || data.respuesta !== true) {
      return NextResponse.json(
        { error: data.mensaje || "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Extraer datos del token JWT (nombreCompleto y email)
    let name = username;
    let email = `${username}@seace.gob.pe`;
    
    try {
      if (data.token) {
         // Guarda el token firmemente en el navegador
         const cookieStore = await cookies();
         cookieStore.set("seace_token", data.token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === "production",
           sameSite: "lax",
           path: "/",
           maxAge: 60 * 60 * 24 * 30, // 30 días
         });

         const creds = Buffer.from(`${username}|||${password}`).toString("base64");
         cookieStore.set("seace_creds", creds, {
           httpOnly: true,
           secure: process.env.NODE_ENV === "production",
           sameSite: "lax",
           path: "/",
           maxAge: 60 * 60 * 24 * 365, // 1 año auto-login
         });

         const payloadBase64Url = data.token.split('.')[1];
         const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
         const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
         const payload = JSON.parse(payloadJson);
         
         if (payload.nombreCompleto) name = payload.nombreCompleto;
         if (payload.email) email = payload.email.toLowerCase();
      }
    } catch (e) {
      console.error("Error procesando el token de SEACE:", e);
    }

    // Asumimos que SEACE lo validó correctamente y devolvemos los datos para el auto-registro
    return NextResponse.json({ success: true, name, email });
  } catch (error) {
    console.error("[SEACE_VERIFY_ERROR]:", error);
    return NextResponse.json(
      { error: "Error al comunicar con SEACE" },
      { status: 500 }
    );
  }
}
