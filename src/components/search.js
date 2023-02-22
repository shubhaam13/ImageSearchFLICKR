
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';

/**
 * A search box component.
 * @param {Function} fetchCustomImages - A function to fetch the custom images
 * @param {String} searchResultsTitle - Search Result Title
 * @returns {Component} returns a component with a search input along with a background
 */

const SearchBox = ({ fetchCustomImages, searchResultsTitle }) => {
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [inputSearchTitle, setInputSearchTitle] = useState('');

  useEffect(() => {
    const titleDelayFn = setTimeout(() => {
      if (inputSearchTitle) {
        // eslint-disable-next-line no-use-before-define
        addSearchHistory(inputSearchTitle.toLowerCase());
      }
      fetchCustomImages(inputSearchTitle.trim().toLowerCase(), 20);
    }, 800);

    return () => clearTimeout(titleDelayFn);
  }, [inputSearchTitle]);

  const getSearchHistoryItems = () => JSON.parse(localStorage.getItem('searchHistory'));

  const updateSearchInput = (searchTitle) => {
    setInputSearchTitle(searchTitle);
    fetchCustomImages(searchTitle, 20);
    setShowSearchHistory(!showSearchHistory);
  };

  const renderSearchHistory = () => {
    const historyItems = getSearchHistoryItems();
    return historyItems.map((_item) => <li className="list-group-item" key={_item} onClick={() => updateSearchInput(_item)}>{_item}</li>);
  };

  const showPastSearches = () => {
    if (getSearchHistoryItems()) {
      setShowSearchHistory(!showSearchHistory);
    }
  };

  const addSearchHistory = (searchTitle) => {
    const historyItems = getSearchHistoryItems();
    if (!historyItems) {
      localStorage.setItem('searchHistory', JSON.stringify([searchTitle]));
    } else {
      localStorage.setItem('searchHistory', JSON.stringify([...new Set([searchTitle, ...historyItems])]));
    }
  };

  const handleOnChange = (event) => {
    const searchTitle = event.target.value.toLowerCase();
    setInputSearchTitle(searchTitle);
  };

  const clearSearchHistory = () => {
    localStorage.removeItem('searchHistory');
    setShowSearchHistory(false);
    toast.success('Search history cleared!');
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, #0a2a50, #2b580c)',paddingBottom: '10px', position: 'sticky', width: '100%', top: '0', zIndex: 1,
      }}
      onMouseLeave={() => setShowSearchHistory(false)}
    >
      <h1 style={{ color: 'white', paddingTop: '20px', textAlign: 'center' }}> Search Photos 📸</h1>
      <div className="active-cyan-4 mx-5 my-4">
        <input className="form-control" type="text" placeholder="🔍 Search Photos" onClick={showPastSearches} onChange={handleOnChange} value={inputSearchTitle} />
        <Toaster position="top-right" />
        {showSearchHistory && (
        <div className="card" style={{ border: 'none' }}>
          <ul
            className="list-group"
            style={{
              maxHeight: '250px', marginBottom: '0px', overflow: 'scroll', WebkitOverflowScrolling: 'touch',
            }}
          >
            {renderSearchHistory()}
          </ul>
          <div className="modal-footer px-1 py-1">
            <button type="button" className="btn btn-danger" onClick={() => clearSearchHistory()}>
              clear
            </button>
          </div>
        </div>
        )}
      </div>
      <p className="my-3" style={{ color: 'white', textAlign: 'center',fontWeight:'bold' ,fontSize: '20px',fontFamily:'cursive' }}>{searchResultsTitle}</p>
    </div>
  );
};

SearchBox.propTypes = {
  fetchCustomImages: PropTypes.func.isRequired,
  searchResultsTitle: PropTypes.string.isRequired,
};

export default SearchBox;
