-- Les ventes survivent à la suppression d'une borne : borne_id passe à NULL et le nom
-- de la borne est conservé pour que Finance continue de les attribuer.
alter table transactions add column if not exists borne_nom text;
alter table transactions alter column borne_id drop not null;

do $$
declare
  fk text;
begin
  select tc.constraint_name into fk
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu on kcu.constraint_name = tc.constraint_name
  where tc.table_name = 'transactions' and tc.constraint_type = 'FOREIGN KEY' and kcu.column_name = 'borne_id';
  if fk is not null then
    execute format('alter table transactions drop constraint %I', fk);
  end if;
end $$;

alter table transactions
  add constraint transactions_borne_id_fkey
  foreign key (borne_id) references bornes(id) on delete set null;
