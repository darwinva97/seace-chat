import { streamText } from "ai";
import { gemini } from "@/lib/ai";
import { seaceTools } from "@/lib/ai/tools";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: gemini,
    system: `Eres un asistente experto en contrataciones públicas del estado peruano. Tu función es ayudar a los usuarios a buscar y cotizar las contrataciones menores o iguales a 8 UIT publicadas en el sistema SEACE.

Reglas:
- Responde siempre en español
- Cuando el usuario pida buscar contrataciones, usa la herramienta searchContracts con los filtros apropiados
- REGLA ESTRICTA: SOLO debes usar 'searchContracts' una (1) vez por mensaje de usuario para buscar. NO llames ningún otro servicio a menos que se te pida específicamente.
- PROHIBIDO llamar a 'getContractDetail' iterativamente. SOLO úsalo si el usuario te pide explícitamente "Ver detalles técnicos" o "Dame detalles de X".
- Si el usuario te pide "mis borradores", "órdenes guardadas como borradores", "filtro de guardados" o cualquier referencia a tus borradores locales, usa la herramienta 'listSavedDrafts' para obtener su historial y muéstralos.
- El año actual es ${new Date().getFullYear()}
- Cuando muestres resultados de búsqueda o borradores, limítate a decir cuántos encontraste y deja que las tarjetas de la UI hagan el trabajo. NO llames a los detalles de cada uno para hacer un resumen.`,
    messages,
    tools: seaceTools,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
