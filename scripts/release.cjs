'use strict';
// Publica uma nova versão no GitHub Releases:  npm run publicar  (patch)  |  npm run publicar:minor
//
// Faz as verificações ANTES de alterar qualquer coisa (token, acesso ao repositório, testes), só então sobe a versão,
// compila e publica; se algo falhar depois de subir a versão, a versão do package.json é restaurada.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (title, ...lines) => {
  console.error(`\n✖ ${title}`);
  lines.forEach((l) => console.error(`  ${l}`));
  console.error('');
  process.exit(1);
};

/** Lê variáveis de um arquivo .env (KEY=valor), sem sobrescrever as já definidas no ambiente. */
function loadEnvFile() {
  const file = path.join(root, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of read('.env').split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (match && !line.trim().startsWith('#') && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const run = (command, args, options = {}) => spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: true, env: process.env, ...options });

async function checkGithub(release, token) {
  const response = await fetch(`https://api.github.com/repos/${release.owner}/${release.repo}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'sicoob-release' },
  }).catch(() => null);
  if (!response) fail('Sem conexão com o GitHub.', 'Verifique a internet e tente novamente.');
  if (response.status === 401) fail('O GH_TOKEN foi recusado pelo GitHub (inválido ou expirado).', 'Crie um novo token (veja docs/publicacao.md) e atualize o arquivo .env.');
  if (response.status === 404) fail(`O token não enxerga o repositório ${release.owner}/${release.repo}.`, 'Confira owner/repo em release.config.json e se o token (fine-grained) foi liberado para ESTE repositório.');
  const data = await response.json();
  if (data.permissions && !data.permissions.push) fail('O token não tem permissão de escrita neste repositório.', 'Dê a permissão "Contents: Read and write" ao token.');
  await checkWrite(release, token);
  return data;
}

/** `permissions.push` da API reflete o papel do usuário, não o token: o teste real é criar (e apagar) uma release rascunho. */
async function checkWrite(release, token) {
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'sicoob-release', 'Content-Type': 'application/json' };
  const base = `https://api.github.com/repos/${release.owner}/${release.repo}/releases`;
  const created = await fetch(base, { method: 'POST', headers, body: JSON.stringify({ tag_name: `preflight-${Date.now()}`, name: 'teste de permissão', draft: true }) }).catch(() => null);
  if (!created) fail('Sem conexão com o GitHub.', 'Verifique a internet e tente novamente.');
  if (created.status === 403 || created.status === 404) {
    fail('O token não pode CRIAR releases neste repositório (403).',
      'No GitHub, edite o token (Settings → Developer settings → Personal access tokens) e, em Repository permissions,',
      'defina "Contents" como "Read and write". Se for um token clássico, marque o escopo "repo". Salve e rode de novo.');
  }
  if (!created.ok) fail(`O GitHub recusou o teste de permissão (HTTP ${created.status}).`, 'Tente novamente em instantes.');
  const draft = await created.json();
  await fetch(`${base}/${draft.id}`, { method: 'DELETE', headers }).catch(() => null);
}

(async () => {
  const bump = process.argv[2] || 'patch';
  if (!['patch', 'minor', 'major'].includes(bump)) fail(`Tipo de versão inválido: "${bump}".`, 'Use: patch, minor ou major.');

  // 1) Verificações (nada é alterado ainda)
  if (!fs.existsSync(path.join(root, 'release.config.json'))) fail('Falta o arquivo release.config.json.', 'Copie release.config.example.json para release.config.json e preencha owner/repo.');
  const release = JSON.parse(read('release.config.json'));
  loadEnvFile();
  if (!process.env.GH_TOKEN) {
    fail('GH_TOKEN não encontrado — sem ele não é possível publicar no GitHub.',
      'Crie um token no GitHub: Settings → Developer settings → Personal access tokens → Fine-grained,',
      `com acesso ao repositório ${release.owner}/${release.repo} e permissão "Contents: Read and write".`,
      'Depois, na pasta do projeto, crie um arquivo chamado .env (já ignorado pelo Git) com uma linha:',
      '    GH_TOKEN=github_pat_xxxxxxxxxxxx',
      'Alternativa: no PowerShell, $env:GH_TOKEN = "github_pat_..." antes de rodar o comando.');
  }
  const repo = await checkGithub(release, process.env.GH_TOKEN);
  if (repo.private) console.warn(`! O repositório é PRIVADO: os computadores instalados não conseguirão baixar as atualizações. Torne-o público (veja docs/publicacao.md).`);

  console.log('\n▶ Rodando lint e testes…');
  if (run('npm', ['run', 'lint']).status !== 0) fail('O lint falhou: nada foi alterado nem publicado.', 'Corrija os avisos e rode o comando de novo.');
  if (run('npm', ['test']).status !== 0) fail('Os testes falharam: nada foi alterado nem publicado.', 'Corrija os testes e rode o comando de novo.');

  // 2) Sobe a versão
  const previous = JSON.parse(read('package.json')).version;
  const originalPackage = read('package.json');
  const originalLock = fs.existsSync(path.join(root, 'package-lock.json')) ? read('package-lock.json') : null;
  if (run('npm', ['version', bump, '--no-git-tag-version']).status !== 0) fail('Não foi possível subir a versão.');
  const next = JSON.parse(read('package.json')).version;
  console.log(`\n▶ Versão ${previous} → ${next}. Compilando e publicando no GitHub…`);

  // 3) Cria a release antes (o electron-builder envia vários arquivos em paralelo e, sem isso, a criação simultânea dá erro 422)
  const apiBase = `https://api.github.com/repos/${release.owner}/${release.repo}/releases`;
  const apiHeaders = { Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'sicoob-release', 'Content-Type': 'application/json' };
  const existing = await fetch(`${apiBase}/tags/v${next}`, { headers: apiHeaders }).catch(() => null);
  if (!existing || existing.status !== 200) {
    await fetch(apiBase, { method: 'POST', headers: apiHeaders, body: JSON.stringify({ tag_name: `v${next}`, name: next, draft: false }) }).catch(() => null);
  }

  // 4) Compila a interface e publica o instalador
  if (run('npm', ['run', 'build']).status !== 0) {
    fs.writeFileSync(path.join(root, 'package.json'), originalPackage);
    if (originalLock) fs.writeFileSync(path.join(root, 'package-lock.json'), originalLock);
    fail('O build falhou; a versão foi restaurada para ' + previous + '.');
  }
  const result = run('npx', ['electron-builder', '--config', 'electron-builder.config.cjs', '--win', '--publish', 'always']);
  if (result.status !== 0) {
    fs.writeFileSync(path.join(root, 'package.json'), originalPackage);
    if (originalLock) fs.writeFileSync(path.join(root, 'package-lock.json'), originalLock);
    fail(`A publicação da versão ${next} falhou; a versão foi restaurada para ${previous}.`,
      'Veja a mensagem acima. Causas comuns: feche o programa que estiver aberto a partir da pasta dist/,',
      'confira a conexão e se já não existe uma release com este número no GitHub (apague-a e tente de novo).');
  }

  console.log(`\n✔ Versão ${next} publicada: https://github.com/${release.owner}/${release.repo}/releases/tag/v${next}`);
  console.log('  Os computadores com o programa instalado vão baixar a atualização sozinhos.');
  console.log('  Não esqueça de enviar o código: git add -A && git commit -m "versão ' + next + '" && git push');
})().catch((error) => fail('Erro inesperado no processo de publicação.', error.message));
