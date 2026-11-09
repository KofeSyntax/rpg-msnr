-- Rode este arquivo UMA vez no Supabase: SQL Editor > New query > Run.
create table if not exists public.colecoes (
  colecao      text        not null,
  id           text        not null,
  dados        jsonb       not null default '{}'::jsonb,
  ordem        bigint      not null default 0,
  cliente      text,
  atualizado_em timestamptz not null default now(),
  primary key (colecao, id)
);

alter table public.colecoes enable row level security;
drop policy if exists "msnr_ler" on public.colecoes;
drop policy if exists "msnr_inserir" on public.colecoes;
drop policy if exists "msnr_atualizar" on public.colecoes;
drop policy if exists "msnr_apagar" on public.colecoes;
create policy "msnr_ler"       on public.colecoes for select to anon using (true);
create policy "msnr_inserir"   on public.colecoes for insert to anon with check (true);
create policy "msnr_atualizar" on public.colecoes for update to anon using (true) with check (true);
create policy "msnr_apagar"    on public.colecoes for delete to anon using (true);

-- Atualização em tempo real (ignore o erro se a tabela já estiver na publicação)
alter publication supabase_realtime add table public.colecoes;

-- Bucket público para imagens (fotos, documentos, unidades)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagens', 'imagens', true, 5242880,
        array['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'])
on conflict (id) do nothing;
drop policy if exists "msnr_imagens_enviar" on storage.objects;
create policy "msnr_imagens_enviar" on storage.objects for insert to anon with check (bucket_id = 'imagens');
