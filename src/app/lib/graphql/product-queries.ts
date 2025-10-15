query SingleProductBySlug($slug: ID!) {  # <-- CHANGED: Type is now ID!
  product(id: $slug, idType: SLUG) {
    # Request the full details needed for a detailed PDP view
    name
    description
    image {
      sourceUrl
      altText
    }
    # Use inline fragments to handle specific product types
 ... on SimpleProduct {
      regularPrice(format: RAW)
      onSale
    }
 ... on VariableProduct {
      variations {
        nodes {
          name
          sku
          regularPrice(format: RAW)
        }
      }
    }
  }
}

query VariableProductQuery {
  products(where: { type: VARIABLE }) {
    nodes {
      # Use __typename to confirm the type (SimpleProduct, VariableProduct, etc.)
      __typename 
      name
      sku
      
    ... on VariableProduct {
        slug
        
        # This section fetches all available variations
        variations {
          nodes {
            name
            sku
            regularPrice(format: RAW)
            
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
    }
  }
}

query ProductListQuery {
  products {
    nodes {
      slug
      name
      sku
    ... on SimpleProduct {
        regularPrice(format: RAW)
      }
    ... on VariableProduct {
        regularPrice(format: RAW)
      }
    }
  }
}