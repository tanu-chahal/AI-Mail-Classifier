import React from 'react';
import MUIPagination from '@mui/material/Pagination';

const Pagination= ({ totalPages, currentPage, onPageChange }) => {

  return (
    <MUIPagination
      count={totalPages}
      page={currentPage}
      color="primary"
      onChange={onPageChange}
      sx={{
        '& .MuiPaginationItem-root': {
          color: 'white', // Sets the color of page numbers
        },
        '& .MuiPaginationItem-page': {
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
          },
          '&:hover': {
            backgroundColor: 'primary.dark',
            color: 'white',
          },
        },
        '& .MuiPaginationItem-previous, & .MuiPaginationItem-next': {
          color: 'white', // Sets the color of prev/next buttons
        },
      }}
    />
  );
};

export default Pagination;
