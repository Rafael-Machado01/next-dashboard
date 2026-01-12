'use client';

import { useDebouncedCallback } from 'use-debounce';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search({ placeholder }: { placeholder: string }) {
  const handleSearch = useDebouncedCallback((term) => {
      // Usando props aqui no typescript precisamos colocar que é string // precisamos definir a variável.
    console.log(term);
    const params = new URLSearchParams(searchParams);
    if(term) {
      params.set('query',term)
    }else {
      params.delete('query') // Se a entrada estiver vazia voce deleta
    }
    replace(`${pathname}?${params.toString()}`) // Pega o pathname(url atual) e adiciona os params que seria nossa query ou term ou entrada do usuario. 
  },300) // agora usando o debounced ele so executa apos 300ms depois que voce parou de digitar.
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => { // Pegamos o E que é o evento pego o value dele e passo para term.
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()} // Deixando em sincronia com a url
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
