import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { EventRecordInfo } from 'utils';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string | any }, b: { [key in Key]: number | string | any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface Column {
  id: keyof EventRecordInfo;
  label: string;
  numeric: boolean;
}

const columns: Column[] = [
  { id: 'blockNumber', numeric: false, label: 'Block Number' },
  { id: 'blockHash', numeric: true, label: 'Block Hash' },
  { id: 'event', numeric: true, label: 'Event' },
  { id: 'arguments', numeric: true, label: 'Arguments' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof EventRecordInfo) => void;
  order: Order;
  orderBy: string;
}

function ScanResultTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof EventRecordInfo) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.numeric ? 'right' : 'left'}
            padding='normal'
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
              {orderBy === column.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: theme.spacing(4),
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

interface ScanResultTableProps {
  loading: boolean;
  events: EventRecordInfo[];
}

const ScanResultTable: React.FC<ScanResultTableProps> = ({ loading, events }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof EventRecordInfo>('blockNumber');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof EventRecordInfo) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, events.length - page * rowsPerPage);

  const loadingContainer = React.useMemo(() => {
    return <TableRow >
      <TableCell colSpan={5} align='center'>
        <CircularProgress />
      </TableCell>
    </TableRow>
  }, []);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant='h5' align='center'>Events</Typography>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="enhanced table"
          >
            <ScanResultTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {loading ? loadingContainer : stableSort<EventRecordInfo>(events, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record, index) =>
                  <TableRow
                    hover
                    onClick={(ev) => handleClick(ev, record.blockHash)}
                    tabIndex={-1}
                    key={index}
                  >
                    <TableCell component="th" id={`scan-result-table-${index}`} scope="row">
                      {record.blockNumber}
                    </TableCell>
                    <TableCell align="right">{record.blockHash}</TableCell>
                    <TableCell align="right">{record.event}</TableCell>
                    <TableCell align="right">{record.arguments}</TableCell>
                  </TableRow>
                )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={events.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default ScanResultTable;
