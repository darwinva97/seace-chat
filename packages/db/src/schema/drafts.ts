import { pgTable, text, timestamp, integer, jsonb, real } from "drizzle-orm/pg-core";
import { user } from "./users";

export const seaceDrafts = pgTable("seace_drafts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  contractId: integer("contract_id").notNull(),
  numero: text("numero"),
  entidad: text("entidad"),
  descripcion: text("descripcion"),
  estado: text("estado").default("BORRADOR"),
  // Ítems de cotización (array de objetos con precios unitarios, cantidades, etc.)
  itemsCotizacion: jsonb("items_cotizacion"),
  // RTM - Requerimientos Técnicos Mínimos (array de objetos con RTM solicitado y ofertado)
  rtmList: jsonb("rtm_list"),
  // Documentos adjuntos (rutas de archivos subidos)
  documentosAdjuntos: jsonb("documentos_adjuntos"),
  // Información adicional
  vigenciaCotizacion: text("vigencia_cotizacion"),
  correoContacto: text("correo_contacto"),
  celularContacto: text("celular_contacto"),
  precioTotal: real("precio_total").default(0),
  // Todo el payload crudo de SEACE para referencia
  payloadSeace: jsonb("payload_seace"),
  // ID oficial generado por SEACE
  idCotizacion: text("id_cotizacion"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
