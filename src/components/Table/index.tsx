/* eslint-disable no-console */
import { Grid, GridCellProps, InfiniteLoader } from 'react-virtualized';
import styles from './styles.module.css';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ERROR_MESSAGES,
  TABLE_COLUMN_WIDTH,
  TABLE_ROW_HEIGHT,
} from 'src/constants';
import Modal from '../Modal';
import { Context } from '../Root';
import { getData } from 'src/libs/http/file';

const Table = () => {
  const { data, handleChangeData, handleLogout } = useContext(Context);
  console.log('🚀 ~ Table ~ data:', data.length);

  const [loadedRows, setLoadedRows] = useState(new Set<number>());
  const [tableSize, setTableSize] = useState<{ width: number; height: number }>(
    { width: 400, height: 500 }
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const isRowLoaded = useCallback(
    ({ index }: { index: number }) => loadedRows.has(index),
    [loadedRows]
  );

  const loadMoreRows = useCallback(
    async ({ startIndex }: { startIndex: number }) => {
      if (!hasNext || isLoading) {
        return;
      }

      const limit = 50;
      const nextIndex = startIndex + limit;

      setLoadedRows((prev) => {
        const newSet = new Set(prev);

        for (let i = startIndex; i < nextIndex; i++) {
          newSet.add(i);
        }

        return newSet;
      });

      try {
        const { data } = await getData({
          start: startIndex,
          limit,
        });

        if (!data.hasNextValues) {
          setHasNext(false);
        }

        handleChangeData(data.data);
      } catch (error: any) {
        setError(error?.response?.data?.message || ERROR_MESSAGES.SMTH_WRONG);

        if (error?.response?.status === 401) {
          handleLogout();
        }
      }
    },
    [handleChangeData, handleLogout, hasNext]
  );

  const cell = useCallback(
    ({ key, style, rowIndex, columnIndex }: GridCellProps) => {
      const content = data[rowIndex]?.[columnIndex] ?? '-';

      return (
        <div key={key} className={styles.cell} style={style} title={content}>
          {content}
        </div>
      );
    },
    [data]
  );

  const handleClose = () => {
    setError(null);
  };

  const handleResize = useCallback(() => {
    const headerHeightVariable =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--header-height'
        )
      ) || 0;
    const defaultEdges = 40;

    setTableSize({
      width: window.innerWidth - defaultEdges,
      height: window.innerHeight - defaultEdges - headerHeightVariable * 2,
    });
  }, []);

  const handleLoadMoreRows = useCallback(
    async ({ startIndex }: { startIndex: number }) => {
      setLoading(true);

      try {
        await loadMoreRows({ startIndex });
      } catch (error: any) {
        setError(error?.response?.data?.message || ERROR_MESSAGES.SMTH_WRONG);
      } finally {
        setLoading(false);
      }
    },
    [isLoading, loadMoreRows]
  );

  useEffect(() => {
    if (data.length === 0) {
      loadMoreRows({ startIndex: 0 });
    }
  }, [data.length]);

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={handleLoadMoreRows}
        rowCount={hasNext ? data.length + 50 : data.length}
      >
        {({ onRowsRendered, registerChild }) => (
          <Grid
            cellRenderer={cell}
            columnCount={data[0]?.length || 0}
            columnWidth={TABLE_COLUMN_WIDTH}
            height={tableSize.height}
            width={tableSize.width}
            rowCount={data.length}
            rowHeight={TABLE_ROW_HEIGHT}
            onSectionRendered={({ rowStartIndex, rowStopIndex }) =>
              onRowsRendered({
                startIndex: rowStartIndex,
                stopIndex: rowStopIndex,
              })
            }
            ref={registerChild}
          />
        )}
      </InfiniteLoader>
      {error ? <Modal handleClose={handleClose} text={error} /> : null}
    </>
  );
};

export default Table;
