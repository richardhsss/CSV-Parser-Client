import { Grid, GridCellProps, InfiniteLoader } from 'react-virtualized';
import styles from './styles.module.css';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ERROR_MESSAGES,
  TABLE_COLUMN_WIDTH,
  TABLE_ROW_HEIGHT,
} from 'src/constants';
import { Context } from '../Root';
import { getData } from 'src/libs/http/file';

const Table = () => {
  const {
    data,
    handleChangeData,
    handleLogout,
    isGlobalLoading,
    setIsGlobalLoading,
    setError,
    isRowLoaded,
    handleChangeLoadedRows,
    hasNext,
    setHasNext,
  } = useContext(Context);
  const [tableSize, setTableSize] = useState<{ width: number; height: number }>(
    { width: 400, height: 500 }
  );

  const handleLoadRows = useCallback(
    async ({ startIndex }: { startIndex: number }) => {
      if (!hasNext || isGlobalLoading) {
        return;
      }

      setIsGlobalLoading(true);

      const limit = 50;
      const nextIndex = startIndex + limit;

      handleChangeLoadedRows({ startIndex, nextIndex });

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
      } finally {
        setIsGlobalLoading(false);
      }
    },
    [
      handleChangeLoadedRows,
      getData,
      setHasNext,
      handleChangeData,
      handleLogout,
      hasNext,
      isGlobalLoading,
      setIsGlobalLoading,
    ]
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

  const handleResize = useCallback(() => {
    // Get the header height variable from the style
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
  }, [setTableSize]);

  useEffect(() => {
    if (data.length === 0) {
      handleLoadRows({ startIndex: 0 });
    }
  }, [data.length]);

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data?.length || !data?.[0]?.length) {
    return <h1 className={styles.title}>Data is empty</h1>;
  }

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={handleLoadRows}
      rowCount={hasNext ? data.length + 50 : data.length}
    >
      {({ onRowsRendered, registerChild }) => (
        <Grid
          className={styles.table}
          cellRenderer={cell}
          columnCount={data[0]?.length || 0}
          rowCount={hasNext ? data.length + 1 : data.length}
          columnWidth={TABLE_COLUMN_WIDTH}
          width={tableSize.width}
          height={tableSize.height}
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
  );
};

export default Table;
