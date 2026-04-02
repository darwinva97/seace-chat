import postgres from 'postgres';

const sql = postgres('postgresql://postgres:Lim25%40Postgres@72.60.243.42:5432/seace_chat');

async function main() {
  const missing = [
    ['descripcion', 'TEXT'],
    ['estado', "TEXT DEFAULT 'BORRADOR'"],
    ['items_cotizacion', 'JSONB'],
    ['rtm_list', 'JSONB'],
    ['documentos_adjuntos', 'JSONB'],
    ['vigencia_cotizacion', 'TEXT'],
    ['correo_contacto', 'TEXT'],
    ['celular_contacto', 'TEXT'],
    ['precio_total', 'REAL DEFAULT 0'],
    ['payload_seace', 'JSONB'],
    ['id_cotizacion', 'TEXT'],
  ];

  for (const [col, type] of missing) {
    try {
      await sql.unsafe(`ALTER TABLE seace_drafts ADD COLUMN IF NOT EXISTS ${col} ${type}`);
      console.log(`OK: ${col}`);
    } catch(e) {
      console.log(`SKIP: ${col} - ${e.message}`);
    }
  }

  const cols2 = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'seace_drafts' ORDER BY ordinal_position`;
  console.log('\nColumnas finales en seace_drafts:');
  for (const c of cols2) console.log(`  ${c.column_name} (${c.data_type})`);

  await sql.end();
}

main().catch(e => { console.error(e); process.exit(1); });
