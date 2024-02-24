import * as React from 'react';

import { useRouter } from 'next/router';

import { Icon } from '@/components/ui/Icon';

interface MobileSearchProps {
  setIsOffcanvasOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const MobileSearch: React.FC<MobileSearchProps> = ({ setIsOffcanvasOpen }) => {
  const router = useRouter();

  const [searchInput, setSearchInput] = React.useState<string>('');

  const handleSearch = () => {
    router.push({
      pathname: '/search',
      query: {
        searchInput,
      },
    });
    setSearchInput('');
    setIsOffcanvasOpen(false);
  };
  const handleEnterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      router.push({
        pathname: '/search',
        query: {
          searchInput,
        },
      });
      setSearchInput('');
      setIsOffcanvasOpen(false);
    }
  };
  return (
    <div className="relative flex h-21 items-center gap-4 border-b border-white px-4">
      <button onClick={() => handleSearch()}>
        <Icon name="search" />
      </button>

      <input
        type="text"
        className="w-full bg-transparent px-1 py-1 text-white placeholder:text-white focus-visible:outline-0"
        placeholder="Search"
        onChange={(e) => setSearchInput(e.target.value)}
        value={searchInput}
        onKeyDown={(e) => handleEnterSearch(e)}
      />
    </div>
  );
};
export default MobileSearch;
