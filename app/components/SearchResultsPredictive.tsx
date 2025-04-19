import { Link, useFetcher, type Fetcher } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import React, { useRef, useEffect } from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import { useAside } from './Aside';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '~/styles/theme';
import { animations } from '~/styles/animations';

type PredictiveSearchItems = PredictiveSearchReturn['result']['items'];

type UsePredictiveSearchReturn = {
  term: React.MutableRefObject<string>;
  total: number;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
};

type SearchResultsPredictiveArgs = Pick<
  UsePredictiveSearchReturn,
  'term' | 'total' | 'inputRef' | 'items'
> & {
  state: Fetcher['state'];
  closeSearch: () => void;
};

type PartialPredictiveSearchResult<
  ItemType extends keyof PredictiveSearchItems,
  ExtraProps extends keyof SearchResultsPredictiveArgs = 'term' | 'closeSearch',
> = Pick<PredictiveSearchItems, ItemType> &
  Pick<SearchResultsPredictiveArgs, ExtraProps>;

type SearchResultsPredictiveProps = {
  children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
};

const searchStyles = {
  container: {
    background: theme.colors.background,
    borderRadius: '16px',
    padding: theme.spacing.lg,
    border: `1px solid ${theme.colors.accent1}`,
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.body.large,
    color: theme.colors.accent2,
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fonts.hero,
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing.sm,
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.sm,
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${theme.colors.accent1}`,
    transition: theme.animations.transition,
  },
  resultImage: {
    borderRadius: '8px',
    overflow: 'hidden',
  },
  resultDetails: {
    flex: 1,
  },
  resultTitle: {
    fontSize: theme.typography.sizes.body.regular,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  resultMeta: {
    fontSize: theme.typography.sizes.body.small,
    color: theme.colors.accent2,
  },
};

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({
  children,
}: SearchResultsPredictiveProps) {
  const aside = useAside();
  const { term, inputRef, fetcher, total, items } = usePredictiveSearch();

  /*
   * Utility that resets the search input
   */
  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  /**
   * Utility that resets the search input and closes the search aside
   */
  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({
  term,
  articles,
  closeSearch,
}: PartialPredictiveSearchResult<'articles'>) {
  if (!articles.length) return null;

  return (
    <motion.div
      style={searchStyles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={animations.transitions.quick}
    >
      <h5 style={searchStyles.sectionTitle}>Articles</h5>
      <motion.ul style={searchStyles.resultsList}>
        <AnimatePresence>
          {articles.map((article) => {
            const articleUrl = urlWithTrackingParams({
              baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
              trackingParams: article.trackingParameters,
              term: term.current ?? '',
            });

            return (
              <motion.li
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={animations.transitions.quick}
              >
                <Link
                  onClick={closeSearch}
                  to={articleUrl}
                  style={searchStyles.resultItem}
                >
                  {article.image?.url && (
                    <div style={searchStyles.resultImage}>
                      <Image
                        alt={article.image.altText ?? ''}
                        src={article.image.url}
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                  <div style={searchStyles.resultDetails}>
                    <motion.span
                      style={searchStyles.resultTitle}
                      whileHover={{ color: theme.colors.accent3 }}
                    >
                      {article.title}
                    </motion.span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
}

function SearchResultsPredictiveCollections({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResult<'collections'>) {
  if (!collections.length) return null;

  return (
    <motion.div
      style={searchStyles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={animations.transitions.quick}
    >
      <h5 style={searchStyles.sectionTitle}>Collections</h5>
      <motion.ul style={searchStyles.resultsList}>
        <AnimatePresence>
          {collections.map((collection) => {
            const collectionUrl = urlWithTrackingParams({
              baseUrl: `/collections/${collection.handle}`,
              trackingParams: collection.trackingParameters,
              term: term.current,
            });

            return (
              <motion.li
                key={collection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={animations.transitions.quick}
              >
                <Link
                  onClick={closeSearch}
                  to={collectionUrl}
                  style={searchStyles.resultItem}
                >
                  {collection.image?.url && (
                    <div style={searchStyles.resultImage}>
                      <Image
                        alt={collection.image.altText ?? ''}
                        src={collection.image.url}
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                  <div style={searchStyles.resultDetails}>
                    <motion.span
                      style={searchStyles.resultTitle}
                      whileHover={{ color: theme.colors.accent3 }}
                    >
                      {collection.title}
                    </motion.span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
}

function SearchResultsPredictivePages({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResult<'pages'>) {
  if (!pages.length) return null;

  return (
    <div className="predictive-search-result" key="pages">
      <h5>Pages</h5>
      <ul>
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item" key={page.id}>
              <Link onClick={closeSearch} to={pageUrl}>
                <div>
                  <span>{page.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveProducts({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResult<'products'>) {
  if (!products.length) return null;

  return (
    <div className="predictive-search-result" key="products">
      <h5>Products</h5>
      <ul>
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          return (
            <li className="predictive-search-result-item" key={product.id}>
              <Link to={productUrl} onClick={closeSearch}>
                {image && (
                  <Image
                    alt={image.altText ?? ''}
                    src={image.url}
                    width={50}
                    height={50}
                  />
                )}
                <div>
                  <p>{product.title}</p>
                  <small>{price && <Money data={price} />}</small>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
}: PartialPredictiveSearchResult<'queries', never> & {
  queriesDatalistId: string;
}) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => {
        if (!suggestion) return null;

        return <option key={suggestion.text} value={suggestion.text} />;
      })}
    </datalist>
  );
}

function SearchResultsPredictiveEmpty() {
  return (
    <motion.div
      style={{
        textAlign: 'center',
        padding: theme.spacing.xl,
        color: theme.colors.accent2,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={animations.transitions.quick}
    >
      <p>No results found</p>
    </motion.div>
  );
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 * @example
 * '''ts
 * const { items, total, inputRef, term, fetcher } = usePredictiveSearch();
 * '''
 **/
function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const term = useRef<string>('');

  if (fetcher.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  const emptyResult = getEmptyPredictiveSearchResult();
  const searchItems = fetcher.data?.result?.items || emptyResult;

  return {
    term,
    total: Object.values(searchItems).reduce((sum, items) => sum + items.length, 0),
    inputRef,
    items: fetcher.data?.result?.items || emptyResult,
    fetcher,
  };
}
