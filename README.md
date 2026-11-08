## En ligne

- Application web : https://senevent-two.vercel.app
- Deploiement continu : chaque merge sur main met la production a jour,
  chaque Pull Request recoit une URL de previsualisation.
- Application Android (APK) :
  https://expo.dev/accounts/rama-diallo/projects/senevent/builds/2f4d9be1-7429-419c-9fdc-cb5d26411a82
- Version mobile : 1.0.0 (profil EAS "preview")

## Lancer le projet en local

- npm install a la racine
- Web : apps/web, creer .env.local (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY), npm run dev
- Mobile : apps/mobile, creer .env (EXPO_PUBLIC_...), npx expo start
