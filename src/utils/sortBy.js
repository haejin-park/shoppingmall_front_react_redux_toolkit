export const transformEnglishSortBy = (sort) => {
  let sortBy = '';
  if(sort === '인기순'){
    sortBy = 'popularity';
  } else if(sort === '최신순'){
    sortBy = 'latest';
  }
  return sortBy;
}