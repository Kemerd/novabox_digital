import { useNavigate } from '@remix-run/react';

/**
 * Represents a product option selection
 */
export interface SelectedOption {
  name: string;
  value: string;
}

/**
 * A hook to get the URL for a variant
 * 
 * @param handle - The handle for the product
 * @param selectedOptions - The selected options for the variant
 * @returns A function to navigate to the variant URL
 */
export function useVariantUrl(
  handle: string,
  selectedOptions?: SelectedOption[],
) {
  const navigate = useNavigate();

  return (optionName?: string, optionValue?: string) => {
    const searchParams = new URLSearchParams();

    // Start with any existing selected options
    selectedOptions?.forEach((option) => {
      searchParams.set(option.name, option.value);
    });

    // Update with the new option
    if (optionName && optionValue) {
      searchParams.set(optionName, optionValue);
    }

    navigate(`/products/${handle}?${searchParams.toString()}`);
  };
}

/**
 * Get the URL for a variant
 * 
 * @param params - The parameters for generating the URL
 * @returns The full URL for the variant
 */
export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions?: SelectedOption[];
}) {
  const params = new URLSearchParams(searchParams);

  // If we receive selectedOptions, use those to build the URL
  if (selectedOptions) {
    selectedOptions.forEach(({name, value}) => {
      params.set(name, value);
    });
  }

  // Return the pathname with updated search params
  return `${pathname}?${params.toString()}`;
}
