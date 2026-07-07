-- Tout le monde peut lire (meme anonyme)
create policy "evenements_select_public"
on public.evenements for select using (true);

-- Un utilisateur authentifie peut inserer, et devient organisateur
create policy "evenements_insert_auth"
on public.evenements for insert to authenticated
with check (organisateur_id = auth.uid());

-- Seul l'organisateur peut modifier son evenement
create policy "evenements_update_owner"
on public.evenements for update to authenticated
using (organisateur_id = auth.uid());

-- Seul l'organisateur peut supprimer son evenement
create policy "evenements_delete_owner"
on public.evenements for delete to authenticated
using (organisateur_id = auth.uid());

-- profiles : lecture publique
create policy "profiles_select_public"
on public.profiles for select using (true);

-- profiles : un utilisateur peut inserer/modifier UNIQUEMENT sa propre ligne
create policy "profiles_insert_self"
on public.profiles for insert to authenticated
with check (id = auth.uid());

create policy "profiles_update_self"
on public.profiles for update to authenticated
using (id = auth.uid());

-- inscriptions : lecture publique
create policy "inscriptions_select_public"
on public.inscriptions for select using (true);

-- inscriptions : un utilisateur ne peut s'inscrire QUE lui-meme
create policy "inscriptions_insert_self"
on public.inscriptions for insert to authenticated
with check (utilisateur_id = auth.uid());

-- inscriptions : et se desinscrire uniquement de ses propres inscriptions
create policy "inscriptions_delete_self"
on public.inscriptions for delete to authenticated
using (utilisateur_id = auth.uid());
