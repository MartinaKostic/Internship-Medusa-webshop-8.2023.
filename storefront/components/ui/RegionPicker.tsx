import classNames from '@/utils/classNames';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { useStore } from '@/lib/context/store-context';
import { useRegions } from 'medusa-react';
import React from 'react';
import { Country } from '@medusajs/medusa';

export interface RegionPickerProps extends React.PropsWithChildren {
  className?: string;
  colorScheme?: string;
}

export const RegionPicker: React.FC<RegionPickerProps> = ({
  className,
  colorScheme,
}) => {
  const { setRegion, getRegion } = useStore();
  const { regions, isSuccess } = useRegions();
  const [allCountries, setAllCountries] = React.useState<Country[]>([]);

  React.useEffect(() => {
    if (regions !== undefined) {
      const countries = regions
        .map((region) => region.countries)
        .reduce((acc, countries) => acc.concat(countries), []);
      setAllCountries(countries);
    }
  }, [regions]);

  const storageRegion = getRegion();

  return regions && isSuccess ? (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button className="flex uppercase focus-visible:outline-none">
          <span
            className={classNames(
              'border-r-[0.0938rem] border-gray-900 pr-[0.5625rem]',
              { 'border-white': colorScheme === 'inverted' },
              className
            )}
          >
            {storageRegion?.countryCode ? `${storageRegion.countryCode}` : ''}
          </span>
          <span className="pl-2">
            {
              regions.find((region) => region.id === storageRegion?.regionId)
                ?.currency_code
            }
          </span>
        </button>
      </Dropdown.Trigger>

      <Dropdown.Content
        className="dropdown-content w-56.5"
        sideOffset={10}
        align="end"
      >
        {allCountries.map((country) => (
          <Dropdown.Item
            className="dropdown-item font-black italic text-primary hover:bg-transparent"
            id={country.iso_2}
            key={country.id}
            onClick={() => {
              country.region_id !== null &&
                setRegion(country.region_id, country.iso_2);
            }}
          >
            {country.display_name}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  ) : null;
};
