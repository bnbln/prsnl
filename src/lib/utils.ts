function sanitizeFields(fields: any, depth = 0) {
  if (!fields || depth > 1) return null;
  
  const sanitizedFields: any = {};
  
  Object.keys(fields).forEach(key => {
    if (key === 'related') {
      // For related articles, only keep basic fields and prevent deeper nesting
      sanitizedFields[key] = fields[key]?.map((item: any) => ({
        fields: {
          title: item.fields?.title || null,
          slug: item.fields?.slug || null,
          published: item.fields?.published || null,
          description: item.fields?.description || null,
          color: item.fields?.color || null,
          image: item.fields?.image || null,
          related: null // Explicitly set to null
        },
        sys: {
          id: item.sys?.id || null,
          contentType: item.sys?.contentType || null
        }
      })) || null;
    } else if (key === 'articles') {
      // Handle articles array
      sanitizedFields[key] = fields[key]?.map((article: any) => ({
        fields: sanitizeFields(article.fields, depth + 1),
        sys: {
          id: article.sys?.id || null,
          contentType: article.sys?.contentType || null
        }
      })) || null;
    } else {
      // Keep other fields as is, but convert undefined to null
      sanitizedFields[key] = fields[key] ?? null;
    }
  });
  
  return sanitizedFields;
}

export function sanitizeContentfulData(data: any[]) {
  return data.map(item => ({
    ...item,
    position: item.position?.map((pos: any) => ({
      fields: sanitizeFields(pos.fields, 0),
      sys: {
        id: pos.sys?.id,
        contentType: pos.sys?.contentType
      }
    }))
  }));
} 