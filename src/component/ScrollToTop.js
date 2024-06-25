import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const {mainCurrentPage, adminCurrentPage} = useSelector((state) => state.product);
  const {currentPage:orderCurrentPage} = useSelector((state) => state.order);
  const {currentPage:cartCurrentPage} = useSelector((state) => state.cart);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname,mainCurrentPage, adminCurrentPage, orderCurrentPage, cartCurrentPage]);

  return null;
}