'use server'

import {z} from 'zod' // Biblioteca de validação do formulário
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {signIn} from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!,)

// Esquema do form
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a costumer.' // Adicionando mensagem de erro.
  }),
  amount: z.coerce.number()
  .gt(0,{message: 'Please enter an amount greater than $0'}),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.'
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });


export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 try {
   await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
 }
 catch(err) {
  console.log(err)
  return {
    message: 'Database Error: Failed a create new Invoice'
  }
 }
 revalidatePath('/dashboard/invoices'); // ISSO VAI LIMPAR O CACHE QUANDO FIZERMOS UMA INSERÇÃO e vai buscar dados no servidor novamente
    redirect('/dashboard/invoices'); // manda para o dashboard

}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
  try {
      await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } 
  catch(err) {
    console.log(err);
    return{
      message: 'Database Error: Failed a edit Invoice.'
    }
  }
   revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch(err) {
    console.log(err);
    return {
      message: 'Database error: Failed a delete Invoice'
    }
  }
    revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch(error) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case 'CredentialsSignin': 
        return 'Invalid credentials.';
        default:
          return 'Algo deu errado (kkkkk)'
      }
    }
    throw error;
  }
}