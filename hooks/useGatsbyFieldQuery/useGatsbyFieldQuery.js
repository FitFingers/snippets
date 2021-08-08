
// Keys: target object to match
// Query: graphql query
// QueryName: graphql query field (allContentfulPage, for instance)
const useFieldQuery = (keys, query, queryName) => {
  const data = useStaticQuery(query)[queryName]
  const { locale } = usePageContext()
  return useMemo(
    () =>
      filter(
        compose(
          equals({ ...keys, node_locale: locale }),
          pick([...Object.keys(keys), 'node_locale']),
          prop('node')
        ),
        data?.edges
      )[0]?.node || {},
    [data, keys, locale]
  )
}