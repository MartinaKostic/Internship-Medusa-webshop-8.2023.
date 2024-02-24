import * as React from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import classNames from '@/utils/classNames';
import { baseClasses, labelBaseClasses } from '@/components/Input';
import { Icon } from '@/components/ui/Icon';
import { useStore } from '@/lib/context/store-context';
import { Country } from '@medusajs/medusa';
import { useRegions } from 'medusa-react';

export interface SelectCountryProps {
  errorMessage?: string;
  disabled?: boolean;
  selectedCountry: Country | undefined;
  onCountryChange: (country: Country) => void;
  regionId?: string;
}

export const SelectCountry: React.FC<SelectCountryProps> = ({
  errorMessage,
  disabled,
  selectedCountry,
  onCountryChange,
  regionId,
}) => {
  const { cart } = useStore();
  const { regions } = useRegions();
  const [allCountries, setAllCountries] = React.useState<Country[]>([]);

  React.useEffect(() => {
    if (regions !== undefined) {
      const countries = regions
        .map((region) => region.countries)
        .reduce((acc, countries) => acc.concat(countries), []);
      setAllCountries(countries);
    }
  }, [regions]);

  return (
    <div className="dropdown-full-width">
      <Dropdown.Root>
        <Dropdown.Trigger asChild disabled={disabled}>
          <button className="dropdown-trigger w-full">
            <div className="relative z-20 w-full">
              <div
                className={classNames(
                  'relative cursor-pointer !pb-1.5 !pt-4.5 text-start lg:!pb-3 lg:!pt-7',
                  { '!border-red-700': Boolean(errorMessage) },
                  baseClasses
                )}
              >
                {selectedCountry?.display_name}
              </div>

              <span
                className={classNames(
                  'left-2.5 top-1 lg:left-4.5 lg:top-3',
                  { 'text-gray-200': disabled },
                  labelBaseClasses
                )}
              >
                Country
              </span>

              <Icon
                name="chevron-down"
                className="pointer-events-none absolute right-4 top-3 transition-all lg:top-5"
              />
            </div>
          </button>
        </Dropdown.Trigger>

        <Dropdown.Content
          className="dropdown-content relative"
          sideOffset={0}
          align="end"
        >
          {regionId
            ? cart?.region.countries.map((country) => {
                return (
                  <Dropdown.Item
                    key={country.id}
                    className="dropdown-item font-black italic text-primary"
                    onSelect={() => onCountryChange(country)}
                  >
                    {country.display_name}
                  </Dropdown.Item>
                );
              })
            : allCountries.map((country) => (
                <Dropdown.Item
                  className="dropdown-item font-black italic text-primary"
                  key={country.id}
                  onSelect={() => onCountryChange(country)}
                >
                  {country.display_name}
                </Dropdown.Item>
              ))}
        </Dropdown.Content>
      </Dropdown.Root>

      {Boolean(errorMessage) && (
        <span className="pt-2 text-xs2 text-red-700">{errorMessage}</span>
      )}
    </div>
  );
};
