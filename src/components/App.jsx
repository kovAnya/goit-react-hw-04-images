import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { fetchImages } from './API/Api';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import * as SC from './App.styled';

export const App = () => {
  const [images, setImages] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [pagesLoadMore, setPagesLoadMore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [largeImgUrl, setLargeImgUrl] = useState('');

  const onSubmit = evt => {
    evt.preventDefault();
    const form = evt.target;
    const query = form.elements.search.value;
    setSearchValue(query);
    setPage(1);
    setImages([]);

    form.reset();
  };

  const onImgClick = evt => {
    const largeImgUrl = evt.target.dataset.bigimg;
    setLargeImgUrl(largeImgUrl);
  };

  const onCloseModal = () => {
    setLargeImgUrl('');
  };

  const loadmore = () => {
    setPage(prevState => prevState + 1);
  };

  useEffect(() => {
    if (!searchValue) {
      return;
    }
    async function fetchApi() {
      setIsLoading(true);

      try {
        const results = await fetchImages(searchValue, page);

        const pages = Math.ceil(results.totalHits / 12);

        setImages(prevImg => [...prevImg, ...results.hits]);
        setPagesLoadMore(pages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApi();
  }, [searchValue, page]);

  return (
    <SC.App>
      <Searchbar onSubmit={onSubmit} />
      {isLoading && <Loader />}
      <ImageGallery images={images} onImgClick={onImgClick} />
      {page < pagesLoadMore && <Button onClick={loadmore} />}
      {largeImgUrl.length > 0 && (
        <Modal onClose={onCloseModal}>
          <img src={largeImgUrl} alt="" />
        </Modal>
      )}
    </SC.App>
  );
};
