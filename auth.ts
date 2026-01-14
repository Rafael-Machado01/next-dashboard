import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import {z} from 'zod';
import type { User } from "./app/lib/definitions";
import bcrypt from 'bcrypt';
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!,{ssl: 'require'});

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
} // Query do user no banco de dados pelo o email.

export const {auth,signIn,signOut} = NextAuth({
   ...authConfig,
   providers: [Credentials({
      async authorize(credentials) {
         const parsedCredentials = z // Definindo a verificação do form de login com zod
         .object({email: z.string().email(), password: z.string().min(6)})
         .safeParse(credentials); // Verifica se as credentials passou na verificação
         if(parsedCredentials.success) { // Se sim crie um objeto com o email e pass
            const {email, password} = parsedCredentials.data;
            const user = await getUser(email); // Faça a query no banco
            if(!user) return null; // Se não achar retorne como nulo.
            const passwordsMatch = await bcrypt.compare(password, user.password) // Compare a pass digitada com a user.password
            // Essa senha vem do nosso definitions no Lib.
            if(passwordsMatch) return user;
         }
         return null // Null no next auth = Login negado
      },
   })],
});