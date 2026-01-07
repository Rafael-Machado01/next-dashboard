// Vamos fazer um next link com map
// Isso deve ser feito em um componente header por exemplo vamos tentar sempre usar isso.
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation' // Isso nos retorna em qual url o user está.
import clsx from 'clsx'
export default function Page() {
   const pathname = usePathname();
   const links = [
      {content: 'A', src: '/a', id: '1'},
      {content: 'B', src: '/b', id: '2'},
    {content: 'C', src: '/exper', id: '3'},
      {content: 'D', src: '/d',id: '4'},
   ]
   return (
      <div>
      <h1>OLá mundo veja meus links</h1>
      {links.map((link) => {
         return (
            <div className='inline'>
            <Link key={link.id} 
            className={clsx(
                'bg-black text-white radius p-2 m-5 hover:text-blue-400 duration-300 transition-colors',
                {
                  'bg-sky-600' : pathname == link.src,
                }, // Um condicional se pathname for igual o href então use esse css.
            )} 
           
            href={link.src}>{link.content}</Link>
            </div>
         )
      })}
      </div>
   )
}  