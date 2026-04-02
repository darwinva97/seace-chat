import postgres from 'postgres';

const sql = postgres('postgresql://postgres:Lim25%40Postgres@72.60.243.42:5432/seace_chat');

async function main() {
  try {
    await sql.unsafe(`ALTER TABLE seace_drafts ALTER COLUMN payload DROP NOT NULL;`);
    console.log('OK: payload DROP NOT NULL');
  } catch(e) {
    console.log(`Error: ${e.message}`);
  }
  await sql.end();
}

main().catch(e => { console.error(e); process.exit(1); });
